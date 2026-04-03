import type { CSSProperties, HTMLAttributes } from "react";
import { withBasePath } from "../../../lib/site";

type SportIconProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
};

export function SoccerBallIcon({ size = 20, className, style, ...props }: SportIconProps) {
  return renderSportIcon({
    assetPath: "/assets/sport_icons/football.svg",
    size,
    className,
    style,
    props,
  });
}

export function GolfBallIcon({ size = 20, className, style, ...props }: SportIconProps) {
  return renderSportIcon({
    assetPath: "/assets/sport_icons/golf.svg",
    size,
    className,
    style,
    props,
  });
}

export function HorseHeadIcon({ size = 20, className, style, ...props }: SportIconProps) {
  return renderSportIcon({
    assetPath: "/assets/sport_icons/horse-racing.svg",
    size,
    className,
    style,
    props,
  });
}

function renderSportIcon({
  assetPath,
  size,
  className,
  style,
  props,
}: {
  assetPath: string;
  size: number;
  className?: string;
  style?: CSSProperties;
  props: HTMLAttributes<HTMLSpanElement>;
}) {
  const assetUrl = withBasePath(assetPath);

  return (
    <span
      aria-hidden="true"
      className={className ? `hub-sport-icon-image ${className}` : "hub-sport-icon-image"}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${assetUrl})`,
        maskImage: `url(${assetUrl})`,
        ...style,
      }}
      {...props}
    />
  );
}
