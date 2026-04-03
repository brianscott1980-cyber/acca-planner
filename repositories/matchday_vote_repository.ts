import { supabase } from "../lib/supabase/client";
import type { MatchdayVoteRecord } from "../types/matchday_vote_type";

const MATCHDAY_VOTES_TABLE = "matchday_votes";

type SaveMatchdayVoteInput = {
  gameWeekId: string;
  memberId: string;
  proposalId: string;
};

type DeleteMatchdayVoteInput = {
  gameWeekId: string;
};

type MatchdayVotesRow = {
  game_week_id: string;
  auth_user_id: string;
  member_id: string;
  proposal_id: string;
  updated_at: string;
};

export async function listMatchdayVotes(gameWeekId: string) {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(MATCHDAY_VOTES_TABLE)
    .select("game_week_id, auth_user_id, member_id, proposal_id, updated_at")
    .eq("game_week_id", gameWeekId);

  if (error) {
    throw new Error(`Failed to load matchday votes: ${error.message}`);
  }

  return (data ?? []).map(mapMatchdayVoteRow);
}

export async function saveMatchdayVote({
  gameWeekId,
  memberId,
  proposalId,
}: SaveMatchdayVoteInput) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const authUserId = await getCurrentAuthUserId();

  const { error } = await supabase.from(MATCHDAY_VOTES_TABLE).upsert(
    {
      game_week_id: gameWeekId,
      auth_user_id: authUserId,
      member_id: memberId,
      proposal_id: proposalId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "game_week_id,auth_user_id",
    },
  );

  if (error) {
    throw new Error(`Failed to save matchday vote: ${error.message}`);
  }
}

export async function deleteMatchdayVote({
  gameWeekId,
}: DeleteMatchdayVoteInput) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const authUserId = await getCurrentAuthUserId();

  const { error } = await supabase
    .from(MATCHDAY_VOTES_TABLE)
    .delete()
    .eq("game_week_id", gameWeekId)
    .eq("auth_user_id", authUserId);

  if (error) {
    throw new Error(`Failed to delete matchday vote: ${error.message}`);
  }
}

export function subscribeToMatchdayVotes(
  gameWeekId: string,
  onVotesChanged: () => void | Promise<void>,
) {
  if (!supabase) {
    return () => undefined;
  }

  const supabaseClient = supabase;
  const channel = supabaseClient
    .channel(`matchday_votes:${gameWeekId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: MATCHDAY_VOTES_TABLE,
        filter: `game_week_id=eq.${gameWeekId}`,
      },
      () => {
        void onVotesChanged();
      },
    )
    .subscribe();

  return () => {
    void supabaseClient.removeChannel(channel);
  };
}

function mapMatchdayVoteRow(row: MatchdayVotesRow): MatchdayVoteRecord {
  return {
    gameWeekId: row.game_week_id,
    authUserId: row.auth_user_id,
    memberId: row.member_id,
    proposalId: row.proposal_id,
    updatedAt: row.updated_at,
  };
}

async function getCurrentAuthUserId() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to read the current Supabase user: ${error.message}`);
  }

  if (!user) {
    throw new Error("No authenticated Supabase user is available for this vote action.");
  }

  return user.id;
}
