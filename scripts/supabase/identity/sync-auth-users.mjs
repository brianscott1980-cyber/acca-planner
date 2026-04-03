#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..", "..");
const USERS_FILE = path.join(REPO_ROOT, "data", "users.ts");
const ENV_FILES = [".env.local", ".env"];

async function main() {
  await loadEnvironmentVariables();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY). Add them to .env.local first.",
    );
  }

  if (supabaseUrl.includes("supabase.com/dashboard/project/")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be your project API URL, for example https://your-project-ref.supabase.co, not the Supabase dashboard URL.",
    );
  }

  const users = await loadUsers();
  const membersWithEmail = users.filter((user) => Boolean(user.email?.trim()));
  const membersWithoutEmail = users.filter((user) => !user.email?.trim());

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const existingUsers = await listAllAuthUsers(supabase);
  const existingUsersByEmail = new Map(
    existingUsers
      .filter((user) => typeof user.email === "string")
      .map((user) => [user.email.trim().toLowerCase(), user]),
  );

  const created = [];
  const updated = [];
  const unchanged = [];

  for (const member of membersWithEmail) {
    const normalizedEmail = member.email.trim().toLowerCase();
    const existingUser = existingUsersByEmail.get(normalizedEmail);
    const nextUserMetadata = buildUserMetadata(member, existingUser);
    const nextAppMetadata = buildAppMetadata(member, existingUser);

    if (!existingUser) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: member.email.trim(),
        email_confirm: true,
        user_metadata: nextUserMetadata,
        app_metadata: nextAppMetadata,
      });

      if (error) {
        throw new Error(
          `Failed to create ${member.displayName} (${member.email}): ${error.message}`,
        );
      }

      created.push({
        email: member.email.trim(),
        id: data.user.id,
      });
      continue;
    }

    const existingUserMetadataJson = JSON.stringify(existingUser.user_metadata ?? {});
    const nextUserMetadataJson = JSON.stringify(nextUserMetadata);
    const existingAppMetadataJson = JSON.stringify(existingUser.app_metadata ?? {});
    const nextAppMetadataJson = JSON.stringify(nextAppMetadata);
    const shouldUpdate =
      !existingUser.email_confirmed_at ||
      existingUserMetadataJson !== nextUserMetadataJson ||
      existingAppMetadataJson !== nextAppMetadataJson;

    if (!shouldUpdate) {
      unchanged.push(member.email.trim());
      continue;
    }

    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email_confirm: true,
      user_metadata: nextUserMetadata,
      app_metadata: nextAppMetadata,
    });

    if (error) {
      throw new Error(
        `Failed to update ${member.displayName} (${member.email}): ${error.message}`,
      );
    }

    updated.push(member.email.trim());
  }

  process.stdout.write("\nSupabase auth sync complete.\n");
  process.stdout.write(`Created: ${created.length}\n`);
  process.stdout.write(`Updated: ${updated.length}\n`);
  process.stdout.write(`Unchanged: ${unchanged.length}\n`);
  process.stdout.write(`Skipped (missing email): ${membersWithoutEmail.length}\n`);

  if (created.length > 0) {
    process.stdout.write("\nCreated users:\n");
    for (const entry of created) {
      process.stdout.write(`- ${entry.email} (${entry.id})\n`);
    }
  }

  if (updated.length > 0) {
    process.stdout.write("\nUpdated users:\n");
    for (const email of updated) {
      process.stdout.write(`- ${email}\n`);
    }
  }

  if (membersWithoutEmail.length > 0) {
    process.stdout.write("\nSkipped members without email:\n");
    for (const member of membersWithoutEmail) {
      process.stdout.write(`- ${member.displayName}\n`);
    }
  }
}

function buildUserMetadata(member, existingUser) {
  return {
    ...(existingUser?.user_metadata ?? {}),
    display_name: member.displayName,
    first_name: member.firstName,
    last_name: member.lastName,
  };
}

function buildAppMetadata(member, existingUser) {
  return {
    ...(existingUser?.app_metadata ?? {}),
    member_id: member.id,
    role: member.role ?? "member",
  };
}

async function loadEnvironmentVariables() {
  for (const fileName of ENV_FILES) {
    const filePath = path.join(REPO_ROOT, fileName);

    try {
      const fileContents = await readFile(filePath, "utf8");
      applyEnvFile(fileContents);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }
}

function applyEnvFile(fileContents) {
  for (const rawLine of fileContents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = stripWrappingQuotes(rawValue);
  }
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

async function loadUsers() {
  const source = await readFile(USERS_FILE, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: USERS_FILE,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const moduleUrl = `data:text/javascript;base64,${encodedSource}`;
  const importedModule = await import(moduleUrl);

  return importedModule.users ?? [];
}

async function listAllAuthUsers(supabase) {
  const users = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Failed to list Supabase auth users: ${error.message}`);
    }

    users.push(...data.users);

    if (data.users.length < perPage) {
      return users;
    }

    page += 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
