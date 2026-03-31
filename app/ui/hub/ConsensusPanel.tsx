"use client";

import { Vote } from "lucide-react";
import {
  getLeadingProposal,
  getProposalVotes,
} from "../../../repositories/gameWeekRepository";
import { trackEvent } from "../../../lib/analytics";
import { getMembers, getUserInitials } from "../../../repositories/userService";
import { useCurrentGameWeek } from "./GameWeekProvider";

export function ConsensusPanel() {
  const { currentGameWeek, loggedInUserId, clearVote } = useCurrentGameWeek();
  const members = getMembers();
  const leadingProposal = getLeadingProposal(currentGameWeek);
  const votesByUserId = currentGameWeek.votesByUserId;
  const hasCurrentUserVote = loggedInUserId
    ? Boolean(votesByUserId[loggedInUserId])
    : false;
  const votedMemberIds = new Set(
    leadingProposal ? getProposalVotes(currentGameWeek, leadingProposal.id) : [],
  );
  const votedMembers = members.filter((member) => votedMemberIds.has(member.id));
  const approvalPercentage =
    members.length === 0 ? 0 : (votedMembers.length / members.length) * 100;
  const ringCircumference = 339.292;
  const ringOffset =
    ringCircumference - (approvalPercentage / 100) * ringCircumference;
  const ringColor = getConsensusRingColor(
    leadingProposal?.riskLevel,
    approvalPercentage,
  );

  return (
    <section className="hub-panel hub-sticky-panel">
      <div className="hub-panel-title-row">
        <Vote size={18} />
        <h2 className="hub-panel-title">Consensus State</h2>
      </div>

      <div className="hub-ring-wrap">
        <svg className="hub-ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="var(--hub-border)"
            strokeWidth="8"
          />
          <circle
            className="hub-ring-progress"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={ringColor}
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div className="hub-ring-center">
          <span className="hub-ring-value">
            {Math.round(approvalPercentage)}%
          </span>
          <span className="hub-ring-label">Approval</span>
          <span className="hub-ring-threshold">Threshold: 50%</span>
        </div>
      </div>

      <div className="hub-voter-block">
        <p className="hub-voter-copy">
          Current Votting ({votedMembers.length}/{members.length})
        </p>
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

      {hasCurrentUserVote ? (
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

function getConsensusRingColor(
  riskLevel: "safe" | "balanced" | "aggressive" | undefined,
  approvalPercentage: number,
) {
  if (!riskLevel || approvalPercentage <= 50) {
    return "var(--hub-primary)";
  }

  if (riskLevel === "safe") {
    return "#10b981";
  }

  if (riskLevel === "balanced") {
    return "#3b82f6";
  }

  return "#f59e0b";
}

function AvatarBadge({
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
      {label}
    </div>
  );
}
