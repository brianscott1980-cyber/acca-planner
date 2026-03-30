"use client";

import {
  createContext,
  useContext,
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
};

const GameWeekContext = createContext<GameWeekContextValue | null>(null);

type GameWeekProviderProps = {
  children: ReactNode;
};

export function GameWeekProvider({ children }: GameWeekProviderProps) {
  const loggedInUser = getLoggedInUser();
  const [currentGameWeek, setCurrentGameWeek] = useState(() => getCurrentGameWeek());

  const value = useMemo<GameWeekContextValue>(
    () => ({
      currentGameWeek,
      loggedInUserId: loggedInUser?.id ?? null,
      castVote(proposalId: string) {
        if (!loggedInUser) {
          return;
        }

        setCurrentGameWeek((previous) =>
          updateUserVoteForGameWeek(previous, loggedInUser.id, proposalId),
        );
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
