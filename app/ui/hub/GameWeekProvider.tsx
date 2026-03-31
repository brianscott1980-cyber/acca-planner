"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GameWeekRecord } from "../../../data/gameWeeks";
import {
  getCurrentGameWeek,
  updateUserVoteForGameWeek,
} from "../../../repositories/gameWeekRepository";
import { getLoggedInUser } from "../../../repositories/authenticationService";

type GameWeekContextValue = {
  currentGameWeek: GameWeekRecord;
  loggedInUserId: string | null;
  castVote: (proposalId: string) => void;
  clearVote: () => void;
};

const GameWeekContext = createContext<GameWeekContextValue | null>(null);

type GameWeekProviderProps = {
  children: ReactNode;
};

export function GameWeekProvider({ children }: GameWeekProviderProps) {
  const loggedInUser = getLoggedInUser();
  const [currentGameWeek, setCurrentGameWeek] = useState(() =>
    getInitialGameWeekState(loggedInUser?.id ?? null),
  );

  useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    const baseGameWeek = getInitialGameWeekState(loggedInUser.id);
    const persistedVote = readPersistedVote(baseGameWeek.id, loggedInUser.id);

    if (!persistedVote || !hasProposal(baseGameWeek, persistedVote)) {
      setCurrentGameWeek(baseGameWeek);
      return;
    }

    setCurrentGameWeek(
      updateUserVoteForGameWeek(baseGameWeek, loggedInUser.id, persistedVote),
    );
  }, [loggedInUser]);

  const value = useMemo<GameWeekContextValue>(
    () => ({
      currentGameWeek,
      loggedInUserId: loggedInUser?.id ?? null,
      castVote(proposalId: string) {
        if (!loggedInUser) {
          return;
        }

        setCurrentGameWeek((previous) => {
          const nextGameWeek = updateUserVoteForGameWeek(
            previous,
            loggedInUser.id,
            proposalId,
          );

          persistVote(nextGameWeek.id, loggedInUser.id, proposalId);

          return nextGameWeek;
        });
      },
      clearVote() {
        if (!loggedInUser) {
          return;
        }

        setCurrentGameWeek((previous) => {
          const nextVotesByUserId = { ...previous.votesByUserId };
          delete nextVotesByUserId[loggedInUser.id];
          clearPersistedVote(previous.id, loggedInUser.id);

          return {
            ...previous,
            votesByUserId: nextVotesByUserId,
          };
        });
      },
    }),
    [currentGameWeek, loggedInUser],
  );

  return (
    <GameWeekContext.Provider value={value}>{children}</GameWeekContext.Provider>
  );
}

export function useCurrentGameWeek() {
  const context = useContext(GameWeekContext);

  if (!context) {
    throw new Error("useCurrentGameWeek must be used within GameWeekProvider");
  }

  return context;
}

function getInitialGameWeekState(loggedInUserId: string | null) {
  const currentGameWeek = getCurrentGameWeek();

  if (!loggedInUserId) {
    return currentGameWeek;
  }

  const nextVotesByUserId = { ...currentGameWeek.votesByUserId };
  delete nextVotesByUserId[loggedInUserId];

  return {
    ...currentGameWeek,
    votesByUserId: nextVotesByUserId,
  };
}

function hasProposal(gameWeek: GameWeekRecord, proposalId: string) {
  return gameWeek.proposals.some((proposal) => proposal.id === proposalId);
}

function getVoteStorageKey(gameWeekId: string, userId: string) {
  return `caddyshack:matchday-vote:${gameWeekId}:${userId}`;
}

function readPersistedVote(gameWeekId: string, userId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(getVoteStorageKey(gameWeekId, userId));
}

function persistVote(gameWeekId: string, userId: string, proposalId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getVoteStorageKey(gameWeekId, userId),
    proposalId,
  );
}

function clearPersistedVote(gameWeekId: string, userId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getVoteStorageKey(gameWeekId, userId));
}
