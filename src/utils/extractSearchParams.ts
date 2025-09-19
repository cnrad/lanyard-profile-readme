import { Data } from "./LanyardTypes";
import { SearchParams } from "./parameters";

export const parseBool = (string: string | undefined): boolean =>
  string === "true" ? true : false;

export const parseAppId = (string: string | undefined): Array<string> => {
  if (string === undefined) return [];
  return string.split(",");
};

export function extractSearchParams(
  params: SearchParams,
  data: Data,
  optimized?: boolean
) {
  const hideStatus = parseBool(params.hideStatus);
  const hideTimestamp = parseBool(params.hideTimestamp);
  const hideBadges = parseBool(params.hideBadges);
  const hideProfile = parseBool(params.hideProfile);
  const hideActivity = (
    params.hideActivity === "true"
      ? true
      : params.hideActivity === "whenNotUsed"
      ? params.hideActivity
      : false
  ) as boolean | "whenNotUsed";
  const hideSpotify = parseBool(params.hideSpotify);

  let hideTag = parseBool(params.hideTag);
  if (!data.discord_user.primary_guild) hideTag = true;

  let hideDecoration = parseBool(params.hideDecoration);
  if (!data.discord_user.avatar_decoration_data) hideDecoration = true;

  const ignoreAppId = parseAppId(params.ignoreAppId);

  let hideDiscrim = parseBool(params.hideDiscrim);
  if (hideDiscrim || data.discord_user.discriminator === "0")
    hideDiscrim = true;

  const showDisplayName = parseBool(params.showDisplayName);
  const animated = parseBool(params.animated);
  const animatedDecoration = parseBool(params.animatedDecoration);

  const clanBackgroundColor: string =
    params.theme === "light" ? "#e0dede" : "#111214";

  return {
    hideStatus,
    hideTimestamp,
    hideBadges,
    hideProfile,
    hideActivity,
    hideSpotify,
    hideTag,
    animatedDecoration,
    hideDecoration,
    ignoreAppId,
    hideDiscrim,
    showDisplayName,
    animated,
    optimized,
    theme: params.theme,
    bg: params.bg,
    clanBackgroundColor: params.clanBackgroundColor ?? clanBackgroundColor,
    borderRadius: params.borderRadius,
    borderColor: params.borderColor,
    idleMessage: params.idleMessage,
  };
}
