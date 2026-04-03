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
import { useRouter } from "next/navigation";
import type { GameWeekRecord } from "../../../types/matchday_type";
import {
  getAccessibleGameWeekById,
  getGameWeekById,
  getCurrentGameWeek,
  getGameWeekIdFromMatchdayNumber,
  getMatchdayHref,
  isGameWeekVoteLocked,
  updateUserVoteForGameWeek,
} from "../../../services/game_week_service";
import { endMatchdayVoting } from "../../../services/matchday_admin_service";
import {
  deleteMatchdayVote,
  listMatchdayVotes,
  saveMatchdayVote,
  subscribeToMatchdayVotes,
} from "../../../repositories/matchday_vote_repository";
import { supabase } from "../../../lib/supabase/client";
import { withBasePath } from "../../../lib/site";
import { getMembers } from "../../../repositories/user_repository";
import { useAuth } from "../auth/AuthProvider";
import { shouldUseRemoteAppData } from "../../../services/app_data_service";

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
  endVoting: () => Promise<void>;
  isEndingVote: boolean;
  voteSimulationStatus: VoteSimulationStatus;
  voteSimulationResult: VoteSimulationResult | null;
  refreshVoteSimulation: () => void;
};

const GameWeekContext = createContext<GameWeekContextValue | null>(null);

const EMPTY_GAME_WEEK: GameWeekRecord = {
  id: "empty-matchday",
  slug: "empty-matchday",
  name: "No Matchdays Available",
  description: "No local matchday data is currently loaded.",
  windowStartIso: new Date(0).toISOString(),
  windowEndIso: new Date(0).toISOString(),
  startsIn: "No schedule loaded",
  proposals: [],
  votesByUserId: {},
};

type GameWeekProviderProps = {
  children: ReactNode;
  gameWeekId?: string | null;
};

export function GameWeekProvider({
  children,
  gameWeekId = null,
}: GameWeekProviderProps) {
  const router = useRouter();
  const { authUser, isConfigured, member: loggedInUser } = useAuth();
  const isRemoteData = shouldUseRemoteAppData();
  const members = getMembers();
  const authUserId = authUser?.id ?? null;
  const loggedInUserId = loggedInUser?.id ?? null;
  const [currentGameWeek, setCurrentGameWeek] = useState(() =>
    getInitialGameWeekState(loggedInUserId, gameWeekId),
  );
  const [voteSimulationStatus, setVoteSimulationStatus] =
    useState<VoteSimulationStatus>("idle");
  const [voteSimulationResult, setVoteSimulationResult] =
    useState<VoteSimulationResult | null>(null);
  const [isEndingVote, setIsEndingVote] = useState(false);
  const voteSimulationTimeoutIdsRef = useRef<number[]>([]);
  const isCurrentGameWeekLocked = isGameWeekVoteLocked(currentGameWeek);

  useEffect(() => () => clearVoteSimulationTimeouts(voteSimulationTimeoutIdsRef), []);

  useEffect(() => {
    clearVoteSimulationTimeouts(voteSimulationTimeoutIdsRef);

    const timeoutId = window.setTimeout(() => {
      setVoteSimulationStatus("idle");
      setVoteSimulationResult(null);
      setCurrentGameWeek(getInitialGameWeekState(loggedInUserId, gameWeekId));
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [gameWeekId, loggedInUserId]);

  useEffect(() => {
    if (
      !isRemoteData ||
      !authUserId ||
      !loggedInUserId ||
      !isConfigured ||
      isCurrentGameWeekLocked
    ) {
      return;
    }

    let isActive = true;
    const currentGameWeekId = currentGameWeek.id;
    let pollIntervalId: number | null = null;

    const syncVotes = async () => {
      try {
        const votes = await listMatchdayVotes(currentGameWeekId);

        if (!isActive) {
          return;
        }

        setCurrentGameWeek((previous) =>
          previous.id !== currentGameWeekId
            ? previous
            : {
                ...previous,
                votesByUserId: mapVotesByUserId(previous, votes),
              },
        );
      } catch (error) {
        console.error(error);
      }
    };

    const syncVotesIfVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }

      void syncVotes();
    };

    void syncVotes();
    pollIntervalId = window.setInterval(syncVotesIfVisible, 5000);
    document.addEventListener("visibilitychange", syncVotesIfVisible);
    const unsubscribe = subscribeToMatchdayVotes(currentGameWeekId, syncVotes);

    return () => {
      isActive = false;
      if (pollIntervalId !== null) {
        window.clearInterval(pollIntervalId);
      }
      document.removeEventListener("visibilitychange", syncVotesIfVisible);
      unsubscribe();
    };
  }, [
    authUserId,
    currentGameWeek.id,
    isConfigured,
    isCurrentGameWeekLocked,
    isRemoteData,
    loggedInUserId,
  ]);

  useEffect(() => {
    if (
      !isRemoteData ||
      !authUserId ||
      !loggedInUserId ||
      !isConfigured ||
      isCurrentGameWeekLocked ||
      !supabase
    ) {
      return;
    }

    let isActive = true;
    const currentGameWeekId = currentGameWeek.id;

    const syncStageIfVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }

      void syncRemoteMatchdayStage({
        currentGameWeekId,
        isActive: () => isActive,
      });
    };

    const pollIntervalId = window.setInterval(syncStageIfVisible, 5000);
    document.addEventListener("visibilitychange", syncStageIfVisible);
    void syncStageIfVisible();

    return () => {
      isActive = false;
      window.clearInterval(pollIntervalId);
      document.removeEventListener("visibilitychange", syncStageIfVisible);
    };
  }, [
    authUserId,
    currentGameWeek.id,
    isConfigured,
    isCurrentGameWeekLocked,
    isRemoteData,
    loggedInUserId,
  ]);

  const value = useMemo<GameWeekContextValue>(
    () => ({
      currentGameWeek,
      loggedInUserId,
      castVote(proposalId: string) {
        if (!loggedInUser) {
          return;
        }

        if (
          isGameWeekVoteLocked(currentGameWeek) ||
          isEndingVote ||
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

        if (isRemoteData && authUserId && isConfigured) {
          const previousVotesByUserId = currentGameWeek.votesByUserId;

          setCurrentGameWeek(nextGameWeek);
          void (async () => {
            let hasSavedVote = false;

            try {
              await saveMatchdayVote({
                gameWeekId: nextGameWeek.id,
                memberId: loggedInUser.id,
                proposalId,
              });
              hasSavedVote = true;

              const consensusResult = getImmediateConsensusResult(nextGameWeek, members);

              if (!consensusResult) {
                return;
              }

              setIsEndingVote(true);
              setVoteSimulationStatus("closed");
              setVoteSimulationResult(consensusResult);

              await endMatchdayVoting(nextGameWeek);
              setCurrentGameWeek(getInitialGameWeekState(loggedInUserId, nextGameWeek.id));

              router.replace(
                getMatchdayHref({
                  gameWeekId: nextGameWeek.id,
                  stage: "pending",
                }),
              );
            } catch (error) {
              console.error(error);
              if (!hasSavedVote) {
                setCurrentGameWeek((previous) =>
                  previous.id !== nextGameWeek.id
                    ? previous
                    : {
                        ...previous,
                        votesByUserId: previousVotesByUserId,
                      },
                );
              }
              setVoteSimulationStatus("idle");
              setVoteSimulationResult(null);
            } finally {
              setIsEndingVote(false);
            }
          })();
          return;
        }

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
          isEndingVote ||
          voteSimulationStatus === "running" ||
          voteSimulationStatus === "closed"
        ) {
          return;
        }

        if (isRemoteData && authUserId && isConfigured) {
          const previousVotesByUserId = currentGameWeek.votesByUserId;

          setCurrentGameWeek((previous) => {
            const nextVotesByUserId = { ...previous.votesByUserId };
            delete nextVotesByUserId[loggedInUser.id];

            return {
              ...previous,
              votesByUserId: nextVotesByUserId,
            };
          });

          void deleteMatchdayVote({
            gameWeekId: currentGameWeek.id,
          }).catch((error) => {
            console.error(error);
            setCurrentGameWeek((previous) =>
              previous.id !== currentGameWeek.id
                ? previous
                : {
                    ...previous,
                    votesByUserId: previousVotesByUserId,
                  },
            );
          });

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
      async endVoting() {
        if (
          !loggedInUser ||
          loggedInUser.role !== "admin" ||
          isGameWeekVoteLocked(currentGameWeek) ||
          isEndingVote
        ) {
          return;
        }

        setIsEndingVote(true);

        try {
          await endMatchdayVoting(currentGameWeek);
          setCurrentGameWeek(getInitialGameWeekState(loggedInUserId, currentGameWeek.id));

          router.replace(
            getMatchdayHref({
              gameWeekId: currentGameWeek.id,
              stage: "pending",
            }),
          );
        } catch (error) {
          console.error(error);
        } finally {
          setIsEndingVote(false);
        }
      },
      isEndingVote,
      voteSimulationStatus,
      voteSimulationResult,
      refreshVoteSimulation() {
        router.replace(
          getMatchdayHref({
            gameWeekId: currentGameWeek.id,
          }),
        );
      },
    }),
    [
      currentGameWeek,
      authUserId,
      isConfigured,
      isEndingVote,
      isRemoteData,
      loggedInUser,
      loggedInUserId,
      members,
      router,
      voteSimulationResult,
      voteSimulationStatus,
    ],
  );

  return (
    <GameWeekContext.Provider value={value}>{children}</GameWeekContext.Provider>
  );
}

function mapVotesByUserId(
  gameWeek: GameWeekRecord,
  votes: Awaited<ReturnType<typeof listMatchdayVotes>>,
) {
  const proposalIds = new Set(gameWeek.proposals.map((proposal) => proposal.id));

  return votes.reduce<Record<string, string>>((accumulator, vote) => {
    if (!proposalIds.has(vote.proposalId)) {
      return accumulator;
    }

    accumulator[vote.memberId] = vote.proposalId;
    return accumulator;
  }, {});
}

function getImmediateConsensusResult(
  gameWeek: GameWeekRecord,
  members: ReturnType<typeof getMembers>,
): VoteSimulationResult | null {
  const consensusThreshold = Math.floor(members.length / 2) + 1;
  const voteCounts = Object.values(gameWeek.votesByUserId).reduce<Record<string, number>>(
    (accumulator, proposalId) => {
      accumulator[proposalId] = (accumulator[proposalId] ?? 0) + 1;
      return accumulator;
    },
    {},
  );
  const sortedVoteEntries = Object.entries(voteCounts).sort((left, right) => right[1] - left[1]);
  const leadingEntry = sortedVoteEntries[0] ?? null;
  const runnerUpEntry = sortedVoteEntries[1] ?? null;

  if (!leadingEntry || leadingEntry[1] < consensusThreshold) {
    return null;
  }

  if (runnerUpEntry && runnerUpEntry[1] === leadingEntry[1]) {
    return null;
  }

  const leadingProposal = gameWeek.proposals.find(
    (proposal) => proposal.id === leadingEntry[0],
  );

  return {
    closedReason: "consensus",
    leadingProposalId: leadingProposal?.id ?? leadingEntry[0],
    leadingProposalTitle: leadingProposal?.title ?? null,
    hasConsensus: true,
  };
}

async function syncRemoteMatchdayStage({
  currentGameWeekId,
  isActive,
}: {
  currentGameWeekId: string;
  isActive: () => boolean;
}) {
  if (!supabase) {
    return;
  }

  try {
    const { data, error } = await supabase
      .from("league_data_matchday_simulations")
      .select("vote_resolved_at_iso")
      .eq("game_week_id", currentGameWeekId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!isActive() || !data?.vote_resolved_at_iso) {
      return;
    }

    if (new Date(data.vote_resolved_at_iso).getTime() > Date.now()) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const nextHref = getMatchdayHref({
      gameWeekId: currentGameWeekId,
      stage: "pending",
    });

    if (
      window.location.pathname === withBasePath("/matchday") &&
      window.location.search === new URL(nextHref, window.location.origin).search
    ) {
      window.location.reload();
      return;
    }

    window.location.assign(withBasePath(nextHref));
  } catch (error) {
    console.error(error);
  }
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
  const resolvedGameWeekId = getGameWeekIdFromMatchdayNumber(gameWeekId) ?? gameWeekId;
  const currentGameWeek =
    getAccessibleGameWeekById(resolvedGameWeekId) ??
    getGameWeekById(resolvedGameWeekId) ??
    getCurrentGameWeek() ??
    EMPTY_GAME_WEEK;

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
