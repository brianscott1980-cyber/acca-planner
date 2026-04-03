"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const loggedSupabaseFetch: typeof fetch = async (input, init) => {
  const tableName = getSupabaseTableName(input);

  if (tableName) {
    console.log("table", tableName);
  }

  return fetch(input, init);
};

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        global: {
          fetch: loggedSupabaseFetch,
        },
      })
    : null;

function getSupabaseTableName(input: Parameters<typeof fetch>[0]) {
  const requestUrl =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

  try {
    const { pathname } = new URL(requestUrl);
    const tablePathPrefix = "/rest/v1/";

    if (!pathname.startsWith(tablePathPrefix)) {
      return null;
    }

    return decodeURIComponent(pathname.slice(tablePathPrefix.length));
  } catch {
    return null;
  }
}
