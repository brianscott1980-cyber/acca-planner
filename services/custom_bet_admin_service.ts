import { persistCustomBetRemote } from "../repositories/custom_bet_admin_repository";
import {
  getCurrentAppDataSnapshot,
  setCurrentAppDataSnapshot,
  shouldUseRemoteAppData,
} from "./app_data_service";
import { getCustomBetById } from "../repositories/custom_bet_repository";

export async function markCustomBetAsStaked({
  customBetId,
  stakeAmount,
  placedDecimalOdds,
  placedAtIso,
}: {
  customBetId: string;
  stakeAmount: number;
  placedDecimalOdds: number;
  placedAtIso: string;
}) {
  const snapshot = getCurrentAppDataSnapshot();
  const currentCustomBet = getCustomBetById(customBetId);

  if (!currentCustomBet) {
    throw new Error(`Custom bet ${customBetId} was not found.`);
  }

  const nextCustomBet = {
    ...currentCustomBet,
    state: "staked" as const,
    stakeAmount,
    placedDecimalOdds,
    placedAtIso,
  };

  if (shouldUseRemoteAppData()) {
    await persistCustomBetRemote(nextCustomBet);
  }

  setCurrentAppDataSnapshot({
    ...snapshot,
    customBets: snapshot.customBets.map((customBet) =>
      customBet.id === customBetId ? nextCustomBet : customBet,
    ),
  });

  return nextCustomBet;
}
