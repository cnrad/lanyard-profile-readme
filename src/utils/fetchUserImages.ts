import { Activity, Data } from "./LanyardTypes";
import { ProfileSettings } from "./parameters";
import { ImageSize } from "./helpers";
import { encodeBase64 } from "./toBase64";

// Module-level cache: appId -> { url, ts }, TTL 1 hour
const rpcIconCache = new Map<string, { url: string | null; ts: number }>();

// Fetches the Discord app icon URL via the public RPC endpoint, with caching
async function fetchRPCIcon(appId: string): Promise<string | null> {
  const cached = rpcIconCache.get(appId);
  if (cached && Date.now() - cached.ts < 3_600_000) return cached.url;
  try {
    const res = await fetch(`https://discord.com/api/v10/applications/${appId}/rpc`);
    if (!res.ok) { rpcIconCache.set(appId, { url: null, ts: Date.now() }); return null; }
    const json: unknown = await res.json();
    const icon = typeof json === "object" && json !== null && "icon" in json && typeof (json as { icon?: unknown }).icon === "string" ? (json as { icon: string }).icon : null;
    const url = icon ? `https://cdn.discordapp.com/app-icons/${appId}/${icon}.webp` : null;
    rpcIconCache.set(appId, { url, ts: Date.now() });
    return url;
  } catch { rpcIconCache.set(appId, { url: null, ts: Date.now() }); return null; }
}

export async function fetchUserImages(data: Data, settings: ProfileSettings) {
  let avatar: string;
  let avatarDecoration: string | null = null;
  let clanBadge: string | null = null;
  let assetLargeImage: string | null = null;
  let assetSmallImage: string | null = null;
  let assetFallbackImage: string | null = null;
  let userEmoji: string | null = null;
  let albumCover: string | null = null;

  const avatarExtension =
    data.discord_user.avatar &&
    data.discord_user.avatar.startsWith("a_") &&
    !settings.optimized
      ? "gif"
      : "webp";

  const statusExtension: string =
    data.activities[0]?.emoji?.animated && !settings.optimized ? "gif" : "webp";

  const userStatus: Activity | undefined =
    data.activities[0] && data.activities[0].type === 4
      ? data.activities[0]
      : undefined;

  const activities = data.activities
    // Filter only type 0
    .filter((activity) => activity.type === 0)
    // Filter ignored app ID
    .filter(
      (activity) =>
        !settings.ignoreAppId?.includes(activity.application_id ?? "")
    );
  const activity: Activity | undefined =
    activities.length > 0 ? activities[0] : undefined;

  if (data.discord_user.avatar) {
    avatar = await encodeBase64(
      `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${
        data.discord_user.avatar
      }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`,
      ImageSize.USER_AVATAR
    );
  } else {
    avatar = await encodeBase64(
      `https://cdn.discordapp.com/embed/avatars/${
        data.discord_user.discriminator === "0"
          ? Number(BigInt(data.discord_user.id) >> BigInt(22)) % 6
          : Number(data.discord_user.discriminator) % 5
      }.png?size=${128}`,
      ImageSize.USER_AVATAR
    );
  }

  if (
    data.discord_user.primary_guild &&
    data.discord_user.primary_guild.identity_guild_id &&
    data.discord_user.primary_guild.badge
  ) {
    clanBadge = await encodeBase64(
      `https://cdn.discordapp.com/clan-badges/${data.discord_user.primary_guild.identity_guild_id}/${data.discord_user.primary_guild.badge}.png?size=32`,
      ImageSize.SERVER_TAG
    );
  }

  if (data.discord_user.avatar_decoration_data?.asset) {
    avatarDecoration = await encodeBase64(
      `https://cdn.discordapp.com/avatar-decoration-presets/${
        data.discord_user.avatar_decoration_data.asset
      }.png?size=64&passthrough=${settings.animatedDecoration || "false"}`,
      ImageSize.USER_DECORATION
    );
  }

  if (activity?.assets?.large_image)
    assetLargeImage = await encodeBase64(
      activity.assets?.large_image.startsWith("mp:external/")
        ? `${activity.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`,
      ImageSize.ACTIVITY_LARGE,
      settings.theme
    );

  if (activity?.assets?.small_image)
    assetSmallImage = await encodeBase64(
      activity.assets.small_image.startsWith("mp:external/")
        ? `${activity.assets.small_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`,
      ImageSize.ACTIVITY_SMALL,
      settings.theme
    );

  if (!activity?.assets?.large_image && activity?.application_id) {
    const iconUrl = await fetchRPCIcon(activity.application_id);
    if (iconUrl) assetFallbackImage = await encodeBase64(iconUrl, ImageSize.ACTIVITY_LARGE, settings.theme);
  }

  if (userStatus?.emoji?.id)
    userEmoji = await encodeBase64(
      `https://cdn.discordapp.com/emojis/${userStatus.emoji.id}.${statusExtension}?size=32`,
      ImageSize.EMOJI
    );

  if (data.spotify?.album_art_url)
    albumCover = await encodeBase64(
      data.spotify.album_art_url,
      ImageSize.ACTIVITY_LARGE
    );

  return {
    avatar,
    clanBadge,
    avatarDecoration,
    assetLargeImage,
    assetSmallImage,
    assetFallbackImage,
    userEmoji,
    albumCover,
  };
}
