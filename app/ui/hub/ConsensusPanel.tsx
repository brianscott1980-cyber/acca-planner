"use client";

import { Vote } from "lucide-react";
import { getLeadingProposal } from "../../../repositories/gameWeekRepository";
import { trackEvent } from "../../../lib/analytics";
import { getMembers, getUserInitials } from "../../../repositories/userService";
import { useCurrentGameWeek } from "./GameWeekProvider";

export function ConsensusPanel() {
  const {
    currentGameWeek,
    loggedInUserId,
    clearVote,
    voteSimulationResult,
    voteSimulationStatus,
  } = useCurrentGameWeek();
  const members = getMembers();
  const leadingProposal = getLeadingProposal(currentGameWeek);
  const votesByUserId = currentGameWeek.votesByUserId;
  const hasCurrentUserVote = loggedInUserId
    ? Boolean(votesByUserId[loggedInUserId])
    : false;
  const votedMembers = members.filter(
    (member) => typeof votesByUserId[member.id] === "string",
  );

  return (
    <section className="hub-panel hub-sticky-panel">
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
              leadingProposal ? ` hub-consensus-leader-${leadingProposal.id}` : ""
            }`}
          >
            {leadingProposal?.title.replace(" Accumulator", "") ?? "TBD"}
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
          Change vote
        </button>
      ) : null}
    </section>
  );
}

export function AvatarBadge({
  label,
  vote,
}: {
  label: string;
  vote?: string;
}) {
  return (
    <div
      className={`hub-avatar-badge${
        vote ? ` hub-avatar-badge-${vote}` : " is-empty"
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
    defensive: 0,
    neutral: 0,
    aggressive: 0,
    noVote: 0,
  };

  for (const member of members) {
    const vote = votesByUserId[member.id];

    if (vote === "defensive") {
      counts.defensive += 1;
      continue;
    }

    if (vote === "neutral") {
      counts.neutral += 1;
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
    { id: "defensive", label: "Defensive", count: counts.defensive, color: "#10b981" },
    { id: "neutral", label: "Neutral", count: counts.neutral, color: "#3b82f6" },
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
