import { Vote } from "lucide-react";

export function ConsensusPanel() {
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
            stroke="var(--hub-primary)"
            strokeDasharray="339.292"
            strokeDashoffset="135.717"
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div className="hub-ring-center">
          <span className="hub-ring-value">60%</span>
          <span className="hub-ring-label">Approval</span>
          <span className="hub-ring-threshold">Threshold: 50%</span>
        </div>
      </div>

      <div className="hub-voter-block">
        <p className="hub-voter-copy">Neutral Votes (3/5)</p>
        <div className="hub-voters">
          <AvatarBadge label="AM" />
          <AvatarBadge label="SJ" />
          <AvatarBadge label="MK" />
          <AvatarBadge label="?" empty />
          <AvatarBadge label="?" empty />
        </div>
      </div>

      <div className="hub-rule-box">
        <p>
          <strong>Consensus rule:</strong> a proposal requires more than 50%
          approval. Current leader is <span>Neutral</span>.
        </p>
      </div>
    </section>
  );
}

function AvatarBadge({
  label,
  empty = false,
}: {
  label: string;
  empty?: boolean;
}) {
  return <div className={`hub-avatar-badge${empty ? " is-empty" : ""}`}>{label}</div>;
}
