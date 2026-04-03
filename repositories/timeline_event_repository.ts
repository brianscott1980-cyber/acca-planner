import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getTimelineEvents() {
  return getCurrentAppDataSnapshot().timelineEvents;
}
