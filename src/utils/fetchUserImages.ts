import { Activity, Data } from "./LanyardTypes";
import { ProfileSettings } from "./parameters";
import { encodeBase64 } from "./toBase64";

export async function fetchUserImages(data: Data, settings: ProfileSettings) {
  let avatar: string;
  let avatarDecoration: string | null = null;
  let clanBadge: string | null = null;
  let assetLargeImage: string | null = null;
  let assetSmallImage: string | null = null;
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
      }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`
    );
  } else {
    avatar = await encodeBase64(
      `https://cdn.discordapp.com/embed/avatars/${
        data.discord_user.discriminator === "0"
          ? Number(BigInt(data.discord_user.id) >> BigInt(22)) % 6
          : Number(data.discord_user.discriminator) % 5
      }.png?size=${128}`
    );
  }

  if (
    data.discord_user.clan &&
    data.discord_user.clan.identity_guild_id &&
    data.discord_user.clan.badge
  ) {
    clanBadge = await encodeBase64(
      `https://cdn.discordapp.com/clan-badges/${data.discord_user.clan.identity_guild_id}/${data.discord_user.clan.badge}.png?size=16`
    );
  }

  if (data.discord_user.avatar_decoration_data?.asset) {
    avatarDecoration = await encodeBase64(
      `https://cdn.discordapp.com/avatar-decoration-presets/${
        data.discord_user.avatar_decoration_data.asset
      }.png?size=64&passthrough=${settings.animatedDecoration || "false"}`
    );
  }

  if (activity?.assets?.large_image)
    assetLargeImage = await encodeBase64(
      activity.assets?.large_image.startsWith("mp:external/")
        ? `https://media.discordapp.net/${activity.assets.large_image.replace(
            "mp:",
            ""
          )}`
        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`,
      settings.bg
    );

  if (activity?.assets?.small_image)
    assetSmallImage = await encodeBase64(
      activity.assets.small_image.startsWith("mp:external/")
        ? `https://media.discordapp.net/${activity.assets.small_image.replace(
            "mp:",
            ""
          )}`
        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`,
      settings.bg
    );

  if (userStatus?.emoji?.id)
    userEmoji = await encodeBase64(
      `https://cdn.discordapp.com/emojis/${
        userStatus.emoji.id
      }.${statusExtension}?size=${32}`
    );

  if (data.spotify?.album_art_url)
    albumCover = await encodeBase64(data.spotify.album_art_url);

  return {
    avatar,
    clanBadge,
    avatarDecoration,
    assetLargeImage,
    assetSmallImage,
    userEmoji,
    albumCover,
  };
}
