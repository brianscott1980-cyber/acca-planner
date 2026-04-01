"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { GameWeekRecord } from "../../../data/gameWeeks";
import {
  getAccessibleGameWeekById,
  getGameWeekById,
  getCurrentGameWeek,
  getMatchdayHref,
  isGameWeekVoteLocked,
  updateUserVoteForGameWeek,
} from "../../../repositories/gameWeekRepository";
import { getLoggedInUser } from "../../../repositories/authenticationService";
import { getMembers } from "../../../repositories/userService";

type VoteSimulationStatus = "idle" | "running" | "closed";

type VoteSimulationResult = {
  closedReason: "consensus" | "no_consensus";
  leadingProposalId: string | null;
  leadingProposalTitle: string | null;
  hasConsensus: boolean;
};

type GameWeekContextValue = {
  currentGameWeek: GameWeekRecord;
  loggedInUserId: string | null;
  castVote: (proposalId: string) => void;
  clearVote: () => void;
  voteSimulationStatus: VoteSimulationStatus;
  voteSimulationResult: VoteSimulationResult | null;
  refreshVoteSimulation: () => void;
};

const GameWeekContext = createContext<GameWeekContextValue | null>(null);

type GameWeekProviderProps = {
  children: ReactNode;
  gameWeekId?: string | null;
};

export function GameWeekProvider({
  children,
  gameWeekId = null,
}: GameWeekProviderProps) {
  const loggedInUser = getLoggedInUser();
  const members = getMembers();
  const [currentGameWeek, setCurrentGameWeek] = useState(() =>
    getInitialGameWeekState(loggedInUser?.id ?? null, gameWeekId),
  );
  const [voteSimulationStatus, setVoteSimulationStatus] =
    useState<VoteSimulationStatus>("idle");
  const [voteSimulationResult, setVoteSimulationResult] =
    useState<VoteSimulationResult | null>(null);
  const voteSimulationTimeoutIdsRef = useRef<number[]>([]);

  useEffect(() => () => clearVoteSimulationTimeouts(voteSimulationTimeoutIdsRef), []);

  const value = useMemo<GameWeekContextValue>(
    () => ({
      currentGameWeek,
      loggedInUserId: loggedInUser?.id ?? null,
      castVote(proposalId: string) {
        if (!loggedInUser) {
          return;
        }

        if (
          isGameWeekVoteLocked(currentGameWeek) ||
          voteSimulationStatus === "running" ||
          voteSimulationStatus === "closed"
        ) {
          return;
        }

        const nextGameWeek = updateUserVoteForGameWeek(
          currentGameWeek,
          loggedInUser.id,
          proposalId,
        );

        persistVote(nextGameWeek.id, loggedInUser.id, proposalId);
        setCurrentGameWeek(nextGameWeek);
        setVoteSimulationStatus("running");
        setVoteSimulationResult(null);
        startVoteSimulation({
          gameWeek: nextGameWeek,
          loggedInUserId: loggedInUser.id,
          members,
          setCurrentGameWeek,
          setVoteSimulationStatus,
          setVoteSimulationResult,
          timeoutIdsRef: voteSimulationTimeoutIdsRef,
        });
      },
      clearVote() {
        if (!loggedInUser) {
          return;
        }

        if (
          isGameWeekVoteLocked(currentGameWeek) ||
          voteSimulationStatus === "running" ||
          voteSimulationStatus === "closed"
        ) {
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
      voteSimulationStatus,
      voteSimulationResult,
      refreshVoteSimulation() {
        if (typeof window === "undefined") {
          return;
        }

        window.location.assign(
          getMatchdayHref({
            gameWeekId: currentGameWeek.id,
          }),
        );
      },
    }),
    [
      currentGameWeek,
      loggedInUser,
      members,
      voteSimulationResult,
      voteSimulationStatus,
    ],
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

function getInitialGameWeekState(
  loggedInUserId: string | null,
  gameWeekId: string | null,
) {
  const currentGameWeek =
    getAccessibleGameWeekById(gameWeekId) ??
    getGameWeekById(gameWeekId) ??
    getCurrentGameWeek();

  if (!loggedInUserId || isGameWeekVoteLocked(currentGameWeek)) {
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

function startVoteSimulation({
  gameWeek,
  loggedInUserId,
  members,
  setCurrentGameWeek,
  setVoteSimulationStatus,
  setVoteSimulationResult,
  timeoutIdsRef,
}: {
  gameWeek: GameWeekRecord;
  loggedInUserId: string;
  members: ReturnType<typeof getMembers>;
  setCurrentGameWeek: Dispatch<SetStateAction<GameWeekRecord>>;
  setVoteSimulationStatus: Dispatch<SetStateAction<VoteSimulationStatus>>;
  setVoteSimulationResult: Dispatch<SetStateAction<VoteSimulationResult | null>>;
  timeoutIdsRef: MutableRefObject<number[]>;
}) {
  clearVoteSimulationTimeouts(timeoutIdsRef);
  const plan = buildVoteSimulationPlan({
    gameWeek,
    loggedInUserId,
    members,
  });

  if (plan.steps.length === 0) {
    setVoteSimulationStatus("closed");
    setVoteSimulationResult(plan.result);
    return;
  }

  plan.steps.forEach((step, index) => {
    const timeoutId = window.setTimeout(() => {
      setCurrentGameWeek((previous) => ({
        ...previous,
        votesByUserId: {
          ...previous.votesByUserId,
          [step.userId]: step.proposalId,
        },
      }));

      if (index === plan.steps.length - 1) {
        setVoteSimulationStatus("closed");
        setVoteSimulationResult(plan.result);
      }
    }, step.delayMs);

    timeoutIdsRef.current.push(timeoutId);
  });
}

function buildVoteSimulationPlan({
  gameWeek,
  loggedInUserId,
  members,
}: {
  gameWeek: GameWeekRecord;
  loggedInUserId: string;
  members: ReturnType<typeof getMembers>;
}) {
  const otherMembers = shuffleArray(
    members.filter((member) => member.id !== loggedInUserId),
    createPrng(`${gameWeek.id}:${loggedInUserId}:order`),
  );
  const proposalIds = gameWeek.proposals.map((proposal) => proposal.id);
  const userProposalId = gameWeek.votesByUserId[loggedInUserId] ?? proposalIds[0] ?? null;
  const totalMembers = members.length;
  const consensusThreshold = Math.floor(totalMembers / 2) + 1;
  const rng = createPrng(`${gameWeek.id}:${userProposalId ?? "neutral"}:simulation`);
  const shouldReachConsensus = rng() < 0.74;
  const baseVoteCounts = Object.fromEntries(
    proposalIds.map((proposalId) => [proposalId, proposalId === userProposalId ? 1 : 0]),
  ) as Record<string, number>;
  const assignmentsByUserId = shouldReachConsensus
    ? buildConsensusAssignments({
        otherMembers,
        proposalIds,
        userProposalId,
        consensusThreshold,
        rng,
      })
    : buildNoConsensusAssignments({
        otherMembers,
        proposalIds,
        userProposalId,
        rng,
      });
  const finalVoteCounts = { ...baseVoteCounts };

  for (const proposalId of Object.values(assignmentsByUserId)) {
    finalVoteCounts[proposalId] = (finalVoteCounts[proposalId] ?? 0) + 1;
  }

  const leadingProposalId = getLeadingProposalId(finalVoteCounts);
  const voteOrder = buildVoteSimulationOrder({
    otherMembers,
    assignmentsByUserId,
    leadingProposalId,
    consensusThreshold,
    currentVoteCounts: baseVoteCounts,
  });
  const voteCounts = { ...baseVoteCounts };
  const steps: Array<{ userId: string; proposalId: string }> = [];
  let closedReason: VoteSimulationResult["closedReason"] = "no_consensus";

  for (const member of voteOrder) {
    const proposalId = assignmentsByUserId[member.id];

    if (!proposalId) {
      continue;
    }

    voteCounts[proposalId] = (voteCounts[proposalId] ?? 0) + 1;
    steps.push({
      userId: member.id,
      proposalId,
    });

    if ((voteCounts[proposalId] ?? 0) >= consensusThreshold) {
      closedReason = "consensus";
      break;
    }
  }

  const resolvedVoteCounts =
    closedReason === "consensus" ? voteCounts : finalVoteCounts;
  const resolvedLeadingProposalId = getLeadingProposalId(resolvedVoteCounts);
  const resolvedLeadingProposal = gameWeek.proposals.find(
    (proposal) => proposal.id === resolvedLeadingProposalId,
  );
  const delays = buildVoteSimulationDelays(steps.length, otherMembers.length);

  return {
    steps: steps.map((step, index) => ({
      userId: step.userId,
      proposalId: step.proposalId,
      delayMs: delays[index] ?? 30000,
    })),
    result: {
      closedReason,
      leadingProposalId: resolvedLeadingProposalId,
      leadingProposalTitle: resolvedLeadingProposal?.title ?? null,
      hasConsensus:
        closedReason === "consensus" &&
        Boolean(
          resolvedLeadingProposalId &&
            (resolvedVoteCounts[resolvedLeadingProposalId] ?? 0) >=
              consensusThreshold,
        ),
    },
  };
}

function buildConsensusAssignments({
  otherMembers,
  proposalIds,
  userProposalId,
  consensusThreshold,
  rng,
}: {
  otherMembers: ReturnType<typeof getMembers>;
  proposalIds: string[];
  userProposalId: string | null;
  consensusThreshold: number;
  rng: () => number;
}) {
  const consensusProposalId =
    userProposalId && rng() < 0.68
      ? userProposalId
      : pickProposalId(
          proposalIds.filter((proposalId) => proposalId !== userProposalId),
          rng,
        ) ??
        userProposalId ??
        proposalIds[0];
  const requiredSupporters = Math.max(
    1,
    consensusThreshold - (consensusProposalId === userProposalId ? 1 : 0),
  );
  const supporterIds = new Set(
    otherMembers.slice(0, requiredSupporters).map((member) => member.id),
  );
  const alternativeProposalIds = proposalIds.filter(
    (proposalId) => proposalId !== consensusProposalId,
  );

  return Object.fromEntries(
    otherMembers.map((member) => [
      member.id,
      supporterIds.has(member.id)
        ? consensusProposalId
        : pickProposalId(alternativeProposalIds, rng) ?? consensusProposalId,
    ]),
  );
}

function buildNoConsensusAssignments({
  otherMembers,
  proposalIds,
  userProposalId,
  rng,
}: {
  otherMembers: ReturnType<typeof getMembers>;
  proposalIds: string[];
  userProposalId: string | null;
  rng: () => number;
}) {
  const firstAlternative =
    pickProposalId(proposalIds.filter((proposalId) => proposalId !== userProposalId), rng) ??
    proposalIds[0];
  const secondAlternative =
    pickProposalId(
      proposalIds.filter(
        (proposalId) =>
          proposalId !== userProposalId && proposalId !== firstAlternative,
      ),
      rng,
    ) ??
    firstAlternative;
  const targetCounts = {
    [userProposalId ?? proposalIds[0]]: 3,
    [firstAlternative]: 2,
    [secondAlternative]: 2,
  };
  const proposalIdPool = Object.entries(targetCounts).flatMap(
    ([proposalId, targetCount]) =>
      Array.from({
        length:
          targetCount - (proposalId === userProposalId ? 1 : 0),
      }).map(() => proposalId),
  );
  const shuffledProposalIdPool = shuffleArray(proposalIdPool, rng);

  return Object.fromEntries(
    otherMembers.map((member, index) => [
      member.id,
      shuffledProposalIdPool[index] ?? firstAlternative,
    ]),
  );
}

function buildVoteSimulationOrder({
  otherMembers,
  assignmentsByUserId,
  leadingProposalId,
  consensusThreshold,
  currentVoteCounts,
}: {
  otherMembers: ReturnType<typeof getMembers>;
  assignmentsByUserId: Record<string, string>;
  leadingProposalId: string | null;
  consensusThreshold: number;
  currentVoteCounts: Record<string, number>;
}) {
  if (!leadingProposalId) {
    return otherMembers;
  }

  const decisiveSupporters = otherMembers.filter(
    (member) => assignmentsByUserId[member.id] === leadingProposalId,
  );
  const otherVoters = otherMembers.filter(
    (member) => assignmentsByUserId[member.id] !== leadingProposalId,
  );
  const requiredSupporters = Math.max(
    0,
    consensusThreshold - (currentVoteCounts[leadingProposalId] ?? 0),
  );

  if (decisiveSupporters.length < requiredSupporters || requiredSupporters === 0) {
    return otherMembers;
  }

  const earlySupporters = decisiveSupporters.slice(0, requiredSupporters - 1);
  const finalSupporter = decisiveSupporters[requiredSupporters - 1];
  const trailingSupporters = decisiveSupporters.slice(requiredSupporters);

  return [...otherVoters, ...earlySupporters, finalSupporter, ...trailingSupporters];
}

function buildVoteSimulationDelays(stepCount: number, totalStepCount: number) {
  if (stepCount <= 0) {
    return [];
  }

  const startDelayMs = 3000;
  const maxEndDelayMs = 30000;
  const progressRatio =
    totalStepCount <= 0 ? 1 : Math.max(stepCount / totalStepCount, 0.35);
  const endDelayMs = Math.round(
    startDelayMs + (maxEndDelayMs - startDelayMs) * progressRatio,
  );
  const usableDuration = Math.max(endDelayMs - startDelayMs, 0);

  return Array.from({ length: stepCount }, (_, index) =>
    stepCount === 1
      ? endDelayMs
      : Math.round(startDelayMs + (usableDuration * index) / (stepCount - 1)),
  );
}

function getLeadingProposalId(voteCounts: Record<string, number>) {
  return Object.entries(voteCounts).reduce<string | null>(
    (leadingProposalId, [proposalId, count]) => {
      if (!leadingProposalId) {
        return proposalId;
      }

      return count > (voteCounts[leadingProposalId] ?? 0)
        ? proposalId
        : leadingProposalId;
    },
    null,
  );
}

function pickProposalId(proposalIds: string[], rng: () => number) {
  if (proposalIds.length === 0) {
    return null;
  }

  return proposalIds[Math.floor(rng() * proposalIds.length)] ?? proposalIds[0];
}

function shuffleArray<T>(items: T[], rng: () => number) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ];
  }

  return nextItems;
}

function clearVoteSimulationTimeouts(
  timeoutIdsRef: MutableRefObject<number[]>,
) {
  for (const timeoutId of timeoutIdsRef.current) {
    window.clearTimeout(timeoutId);
  }

  timeoutIdsRef.current = [];
}

function createPrng(seedInput: string) {
  let seed = hashString(seedInput) || 1;

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
