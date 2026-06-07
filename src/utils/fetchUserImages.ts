import { Activity, Data } from "./LanyardTypes";
import { ProfileSettings } from "./parameters";
import { ImageSize } from "./helpers";
import { encodeBase64 } from "./toBase64";

export async function fetchUserImages(data: Data, settings: ProfileSettings) {
  let avatar: string;
  let avatarDecoration: string | null = null;
  let clanBadge: string | null = null;
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

  const activityImages: Array<{ largeImage: string | null; smallImage: string | null }> = [];
  for (const act of activities) {
    let largeImage: string | null = null;
    let smallImage: string | null = null;

    if (act.assets?.large_image) {
      largeImage = await encodeBase64(
        act.assets.large_image.startsWith("mp:external/")
          ? `${act.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
          : `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.webp`,
        ImageSize.ACTIVITY_LARGE,
        settings.theme
      );
    } else if (act.application_id) {
      try {
        const appInfo = await fetch(
          `https://discord.com/api/v9/applications/${act.application_id}/rpc`,
          {
            next: { revalidate: 86400 } // Cache application details for 1 day
          }
        ).then(res => res.ok ? res.json() as Promise<{ icon?: string } | null> : null);

        if (appInfo && appInfo.icon) {
          largeImage = await encodeBase64(
            `https://cdn.discordapp.com/app-icons/${act.application_id}/${appInfo.icon}.webp`,
            ImageSize.ACTIVITY_LARGE,
            settings.theme
          );
        }
      } catch (error) {
        console.error(`Failed to fetch fallback icon for app ${act.application_id}:`, error);
      }
    }

    if (act.assets?.small_image)
      smallImage = await encodeBase64(
        act.assets.small_image.startsWith("mp:external/")
          ? `${act.assets.small_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
          : `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.small_image}.webp`,
        ImageSize.ACTIVITY_SMALL,
        settings.theme
      );

    activityImages.push({ largeImage, smallImage });
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

  // Fetch album art from non-Spotify listening activity (e.g. Apple Music via discord-music-presence)
  if (!albumCover) {
    const musicActivity = data.activities.find((a) => a.type === 2 && !data.listening_to_spotify);
    if (musicActivity?.assets?.large_image)
      albumCover = await encodeBase64(
        musicActivity.assets.large_image.startsWith("mp:external/")
          ? `${musicActivity.assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
          : `https://cdn.discordapp.com/app-assets/${musicActivity.application_id}/${musicActivity.assets.large_image}.webp`,
        ImageSize.ACTIVITY_LARGE
      );
  }

  return {
    avatar,
    clanBadge,
    avatarDecoration,
    activityImages,
    userEmoji,
    albumCover,
  };
}
