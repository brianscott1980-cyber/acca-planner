"use client";

import { Crown, Flame, Scale, Shield, Vote } from "lucide-react";
import { getLeadingProposal } from "../../../services/game_week_service";
import { trackEvent } from "../../../lib/analytics";
import { getMembers } from "../../../repositories/user_repository";
import { getUserInitials } from "../../../services/user_service";
import { useAuth } from "../auth/AuthProvider";
import { useCurrentGameWeek } from "./GameWeekProvider";

export function ConsensusPanel() {
  const {
    currentGameWeek,
    loggedInUserId,
    clearVote,
    endVoting,
    isEndingVote,
    voteSimulationResult,
    voteSimulationStatus,
  } = useCurrentGameWeek();
  const { member: currentUser } = useAuth();
  const members = getMembers();
  const leadingProposal = getLeadingProposal(currentGameWeek);
  const votesByUserId = currentGameWeek.votesByUserId;
  const currentUserVote = loggedInUserId ? votesByUserId[loggedInUserId] ?? null : null;
  const hasCurrentUserVote = loggedInUserId
    ? getNormalizedVoteChoice(currentUserVote) !== null
    : false;
  const isAdminUser = currentUser?.role === "admin";
  const votedMembers = members.filter(
    (member) => getNormalizedVoteChoice(votesByUserId[member.id]) !== null,
  );

  return (
    <section className="hub-panel hub-sticky-panel">
      {isAdminUser ? (
        <div className="hub-admin-controls hub-mobile-admin-controls">
          <div className="hub-admin-controls-main">
            <span className="hub-admin-controls-icon">
              <Crown size={16} />
            </span>
            <div>
              <p className="hub-admin-controls-title">Admin Controls</p>
              <p className="hub-admin-controls-copy">
                Review the three acca groups and commit the matchday vote once
                the final strategy is ready to be locked in.
              </p>
            </div>
          </div>
          <button
            className="hub-primary-button"
            type="button"
            disabled={isEndingVote}
            onClick={() => {
              trackEvent("admin_commit_vote_clicked", {
                matchday_id: currentGameWeek.id,
                surface: "consensus_panel_mobile",
              });
              void endVoting();
            }}
          >
            {isEndingVote ? "Ending Voting..." : "End Voting"}
          </button>
        </div>
      ) : null}

      <div className="hub-panel-title-row">
        <Vote size={18} />
        <h2 className="hub-panel-title">Consensus State</h2>
      </div>

      <ConsensusVoteBreakdown members={members} votesByUserId={votesByUserId} />

      <VotesAvatarRow
        label={`Current Votting (${votedMembers.length}/${members.length})`}
        members={members}
        votesByUserId={votesByUserId}
      />

      <div className="hub-rule-box">
        <p>
          <strong>Consensus rule:</strong> a proposal requires more than 50%
          approval. Current leader is{" "}
            <span
              className={`hub-consensus-leader${
              leadingProposal
                ? ` hub-consensus-leader-${leadingProposal.riskLevel}`
                : ""
              }`}
            >
            {formatProposalLabel(leadingProposal?.riskLevel) ?? "currently tied"}
          </span>.
        </p>
      </div>

      {voteSimulationStatus === "running" ? (
        <div className="hub-rule-box hub-rule-box-live">
          <p>
            <strong>Voting is open:</strong> the consensus graph will keep
            updating as votes come in.
          </p>
        </div>
      ) : null}

      {voteSimulationStatus === "closed" && voteSimulationResult ? (
        <div className="hub-rule-box hub-rule-box-live">
          <p>
            <strong>Voting closed:</strong>{" "}
            {voteSimulationResult.hasConsensus
              ? `${voteSimulationResult.leadingProposalTitle ?? "A strategy"} reached consensus.`
              : "All votes were cast without consensus."}
          </p>
        </div>
      ) : null}

      {hasCurrentUserVote && voteSimulationStatus === "idle" ? (
        <>
          <p className="hub-mobile-vote-message">
            <span className="hub-mobile-vote-message-content">
              <span
                className={`hub-proposal-icon hub-mobile-vote-message-icon ${getVoteMessageIconClassName(
                  currentUserVote,
                )}`}
                aria-hidden="true"
              >
                <VoteMessageIcon vote={currentUserVote} />
              </span>
              <span className={getVoteMessageTextClassName(currentUserVote)}>
                You voted {formatVoteLabel(currentUserVote)}
              </span>
            </span>
          </p>
          <button
            className="hub-secondary-button hub-mobile-change-vote"
            type="button"
            onClick={() => {
              trackEvent("clear_vote", {
                surface: "consensus_panel_mobile",
              });
              clearVote();
            }}
          >
            Change my Vote
          </button>
          {isAdminUser ? (
            <button
              className="hub-secondary-button hub-mobile-end-voting"
              type="button"
              disabled={isEndingVote}
              onClick={() => {
                trackEvent("admin_commit_vote_clicked", {
                  matchday_id: currentGameWeek.id,
                  surface: "consensus_panel_mobile_post_vote",
                });
                void endVoting();
              }}
            >
              {isEndingVote ? "Ending Voting..." : "End Voting"}
            </button>
          ) : null}
        </>
      ) : null}

    </section>
  );
}

function formatVoteLabel(vote: string | null) {
  const normalizedVote = getNormalizedVoteChoice(vote);

  if (normalizedVote) {
    return formatProposalLabel(normalizedVote);
  }

  return "Unknown";
}

function VoteMessageIcon({ vote }: { vote: string | null }) {
  const normalizedVote = getNormalizedVoteChoice(vote);

  if (normalizedVote === "safe") {
    return <Shield size={16} />;
  }

  if (normalizedVote === "balanced") {
    return <Scale size={16} />;
  }

  if (normalizedVote === "aggressive") {
    return <Flame size={16} />;
  }

  return <Vote size={16} />;
}

function getVoteMessageIconClassName(vote: string | null) {
  const normalizedVote = getNormalizedVoteChoice(vote);

  if (normalizedVote === "safe") {
    return "hub-proposal-icon-safe";
  }

  if (normalizedVote === "balanced") {
    return "hub-proposal-icon-balanced";
  }

  if (normalizedVote === "aggressive") {
    return "hub-proposal-icon-aggressive";
  }

  return "";
}

function getVoteMessageTextClassName(vote: string | null) {
  const normalizedVote = getNormalizedVoteChoice(vote);

  if (normalizedVote === "safe") {
    return "hub-success-text";
  }

  if (normalizedVote === "balanced") {
    return "hub-accent-text";
  }

  if (normalizedVote === "aggressive") {
    return "hub-warning-text";
  }

  return "";
}

export function AvatarBadge({
  label,
  vote,
}: {
  label: string;
  vote?: string;
}) {
  const normalizedVote = getNormalizedVoteChoice(vote);

  return (
    <div
      className={`hub-avatar-badge${
        normalizedVote ? ` hub-avatar-badge-${normalizedVote}` : " is-empty"
      }`}
    >
      <span className="hub-avatar-badge-label">{label}</span>
    </div>
  );
}

export function VotesAvatarRow({
  label,
  members,
  votesByUserId,
  className = "",
}: {
  label?: string;
  members: ReturnType<typeof getMembers>;
  votesByUserId: Record<string, string>;
  className?: string;
}) {
  return (
    <div className={`hub-voter-block${className ? ` ${className}` : ""}`}>
      {label ? <p className="hub-voter-copy">{label}</p> : null}
      <div className="hub-voters">
        {members.map((member) => (
          <AvatarBadge
            key={member.id}
            label={getUserInitials(member.displayName)}
            vote={votesByUserId[member.id]}
          />
        ))}
      </div>
    </div>
  );
}

export function ConsensusVoteBreakdown({
  members,
  votesByUserId,
}: {
  members: ReturnType<typeof getMembers>;
  votesByUserId: Record<string, string>;
}) {
  const segments = getVoteBreakdownSegments(members, votesByUserId);
  const votedCount = segments
    .filter((segment) => segment.id !== "no-vote")
    .reduce((total, segment) => total + segment.count, 0);

  return (
    <div className="hub-vote-breakdown">
      <div className="hub-vote-breakdown-chart" aria-hidden="true">
        <svg
          className="hub-vote-breakdown-chart-svg"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {segments.map((segment) => (
            <circle
              key={segment.id}
              className="hub-vote-breakdown-segment"
              cx="50"
              cy="50"
              r="44"
              pathLength={100}
              stroke={segment.color}
              strokeDasharray={`${segment.length} ${100 - segment.length}`}
              strokeDashoffset={-segment.start}
            />
          ))}
        </svg>
        <div className="hub-vote-breakdown-center">
          <span className="hub-vote-breakdown-value">
            {votedCount}/{members.length}
          </span>
          <span className="hub-vote-breakdown-label">Voted</span>
        </div>
      </div>

      <div className="hub-vote-breakdown-legend">
        {segments.map((segment) => (
          <span key={segment.id} className="hub-vote-breakdown-legend-item">
            <span
              className="hub-vote-breakdown-legend-dot"
              style={{ background: segment.color }}
              aria-hidden="true"
            />
            <span>{segment.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function getVoteBreakdownSegments(
  members: ReturnType<typeof getMembers>,
  votesByUserId: Record<string, string>,
) {
  const counts = {
    safe: 0,
    balanced: 0,
    aggressive: 0,
    noVote: 0,
  };

  for (const member of members) {
    const vote = getNormalizedVoteChoice(votesByUserId[member.id]);

    if (vote === "safe") {
      counts.safe += 1;
      continue;
    }

    if (vote === "balanced") {
      counts.balanced += 1;
      continue;
    }

    if (vote === "aggressive") {
      counts.aggressive += 1;
      continue;
    }

    counts.noVote += 1;
  }

  let start = 0;

  return [
    { id: "safe", label: "Defensive", count: counts.safe, color: "#10b981" },
    { id: "balanced", label: "Balanced", count: counts.balanced, color: "#3b82f6" },
    { id: "aggressive", label: "Aggressive", count: counts.aggressive, color: "#f59e0b" },
    { id: "no-vote", label: "No vote", count: counts.noVote, color: "#52525b" },
  ].map((segment) => {
    const length = members.length > 0 ? (segment.count / members.length) * 100 : 0;
    const nextSegment = {
      ...segment,
      start,
      length,
    };

    start += length;
    return nextSegment;
  });
}

function getNormalizedVoteChoice(vote: string | null | undefined) {
  if (!vote) {
    return null;
  }

  const normalizedVote = vote.toLowerCase().trim();

  if (
    normalizedVote === "safe" ||
    normalizedVote === "defensive" ||
    normalizedVote.endsWith("-proposal-safe")
  ) {
    return "safe";
  }

  if (
    normalizedVote === "balanced" ||
    normalizedVote === "neutral" ||
    normalizedVote.endsWith("-proposal-balanced")
  ) {
    return "balanced";
  }

  if (
    normalizedVote === "aggressive" ||
    normalizedVote.endsWith("-proposal-aggressive")
  ) {
    return "aggressive";
  }

  return null;
}

function formatProposalLabel(riskLevel: "safe" | "balanced" | "aggressive" | null | undefined) {
  if (riskLevel === "safe") {
    return "Defensive";
  }

  if (riskLevel === "balanced") {
    return "Balanced";
  }

  if (riskLevel === "aggressive") {
    return "Aggressive";
  }

  return null;
}
