import { Activity, Data } from "@/utils/LanyardTypes";
import { Badges, UnknownIconDark, UnknownIconLight } from "@/utils/badges";
import { elapsedTime, getFlags, getImageDataUri } from "@/utils/helpers";
import { ProfileSettings } from "@/utils/parameters";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

interface ProfileCardProps {
  settings: ProfileSettings;
  data: Data;
  images: {
    avatar: string | null;
    avatarDecoration: string | null;
    clanBadge: string | null;
    activityImages: Array<{ largeImage: string | null; smallImage: string | null }>;
    userEmoji: string | null;
    albumCover: string | null;
  };
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  settings,
  data,
  images,
}: ProfileCardProps) => {
  const {
    hideStatus,
    hideTimestamp,
    hideBadges,
    hideProfile,
    hideActivity,
    hideSpotify,
    hideAppleMusic,
    hideTag,
    hideDecoration,
    ignoreAppId,
    hideDiscrim,
    showDisplayName,
    theme = "dark",
    bg,
    clanBackgroundColor,
    borderRadius = "10px",
    idleMessage = "I'm not currently doing anything!",
  } = settings;

  const {
    avatar,
    avatarDecoration,
    clanBadge,
    activityImages,
    userEmoji,
    albumCover,
  } = images;

  let avatarBorderColor: string = "#747F8D";
  const backgroundColor: string =
    bg ?? (theme === "light" ? "ededed" : "1a1c1f");

  switch (data.discord_status) {
    case "online":
      avatarBorderColor = "#43B581";
      break;
    case "idle":
      avatarBorderColor = "#FAA61A";
      break;
    case "dnd":
      avatarBorderColor = "#F04747";
      break;
    case "offline":
      avatarBorderColor = "#747F8D";
      break;
  }

  const flags: string[] = getFlags(data.discord_user.public_flags);
  if (data.discord_user.avatar && data.discord_user.avatar.includes("a_"))
    flags.push("Nitro");

  let userStatus: Activity | null = null;
  if (data.activities[0] && data.activities[0].type === 4)
    userStatus = data.activities[0];

  const activities = data.activities
    // Filter only type 0
    .filter((activity) => activity.type === 0)
    // Filter ignored app ID
    .filter(
      (activity) => !ignoreAppId?.includes(activity.application_id ?? "")
    );
  // Non-Spotify listening activity (e.g. Apple Music via discord-music-presence)
  const musicActivity: Activity | undefined = !data.listening_to_spotify
    ? data.activities.find((a) => a.type === 2)
    : undefined;
  const isAppleMusic = musicActivity?.name === "Apple Music";
  const showMusicActivity = !!(musicActivity && !(isAppleMusic && hideAppleMusic));

  const width = "410px";
  const hasAnyListening = data.listening_to_spotify || showMusicActivity;

  const showActivitySection = hideActivity !== true &&
    !(hideActivity === "whenNotUsed" && activities.length === 0 && !hasAnyListening);

  const ACTIVITY_BLOCK_H = 110;

  // Calculate activity section height based on visible content
  const activitySectionH = (() => {
    if (!showActivitySection) return 0;

    let height = 0;
    if (activities.length > 0) {
      height += activities.length * ACTIVITY_BLOCK_H;
    }

    const hasSpotify = data.listening_to_spotify && !hideSpotify;
    if (hasSpotify) {
      height += ACTIVITY_BLOCK_H;
    } else if (showMusicActivity) {
      height += ACTIVITY_BLOCK_H;
    }

    if (activities.length === 0 && !hasSpotify && !showMusicActivity) {
      height = ACTIVITY_BLOCK_H; // idle message
    }

    return height;
  })();

  const height = (() => {
    if (hideProfile && activitySectionH === 0) return "40";
    if (hideProfile) return String(activitySectionH + 20);
    if (activitySectionH === 0) return "91";
    return String(100 + activitySectionH);
  })();

  // Calculate height of main div element
  const divHeight = String(Number(height) - 10);

  const ForeignDiv = (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLDivElement> & { xmlns: string },
      HTMLDivElement
    >
  ) => <div {...props}>{props.children}</div>;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <foreignObject x="0" y="0" width="410" height={height}>
        <ForeignDiv
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            position: "absolute",
            width: "400px",
            height: `${divHeight}px`,
            inset: 0,
            backgroundColor: `#${backgroundColor}`,
            color: theme === "dark" ? "#fff" : "#000",
            fontFamily: `'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
            padding: "5px",
            borderRadius: borderRadius,
          }}
        >
          {!hideProfile ? (
            <div
              style={{
                width: "400px",
                height: "100px",
                inset: 0,
                display: "flex",
                flexDirection: "row",
                paddingBottom: "5px",
                borderBottom: !showActivitySection
                    ? "none"
                    : `solid 0.5px ${
                        theme === "dark"
                          ? "hsl(0, 0%, 100%, 10%)"
                          : "hsl(0, 0%, 0%, 10%)"
                      }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  flexDirection: "row",
                  height: "80px",
                  width: "80px",
                }}
              >
                <img
                  src={getImageDataUri(avatar)}
                  alt="User Avatar"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    position: "relative",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {hideDecoration ||
                !data.discord_user.avatar_decoration_data ? null : (
                  <>
                    <img
                      src={getImageDataUri(avatarDecoration!)}
                      alt="Avatar Decoration"
                      style={{
                        display: "block",
                        width: "64px",
                        height: "64px",
                        position: "absolute",
                        top: " 50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </>
                )}

                <span
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    right: "14px",
                    height: "13px",
                    width: "13px",
                    backgroundColor: avatarBorderColor,
                    borderRadius: "50%",
                    border: `3px solid #${backgroundColor}`,
                  }}
                />
              </div>

              <div
                style={{
                  height: "80px",
                  width: "260px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "25px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "1.15rem",
                      margin: "0 12px 0 0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {showDisplayName && data.discord_user.global_name
                      ? data.discord_user.global_name
                      : data.discord_user.username}

                    {!hideDiscrim && !showDisplayName ? (
                      <span
                        style={{
                          color: theme === "dark" ? "#ccc" : "#666",
                          fontWeight: "lighter",
                        }}
                      >
                        #{data.discord_user.discriminator}
                      </span>
                    ) : null}
                  </h1>

                  {hideTag ||
                  (!data.discord_user.primary_guild?.tag &&
                    !data.discord_user.primary_guild?.badge) ? null : (
                    <span
                      style={{
                        backgroundColor: clanBackgroundColor,
                        borderRadius: " 0.375rem",
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
                        marginLeft: "-6px",
                        marginRight: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
                        height: "100%",
                      }}
                    >
                      <img
                        src={getImageDataUri(clanBadge!)}
                        alt="Clan Badge"
                        style={{
                          width: "16px",
                          height: "16px",
                        }}
                      />
                      <p
                        style={{ marginBottom: "1.1rem", whiteSpace: "nowrap" }}
                      >
                        {data.discord_user.primary_guild.tag}
                      </p>
                    </span>
                  )}

                  {!!hideBadges
                    ? null
                    : flags.map((v) => (
                        <img
                          key={v}
                          alt={v}
                          src={getImageDataUri(Badges[v])}
                          style={{
                            width: "auto",
                            height: "20px",
                            position: "relative",
                            top: "50%",
                            transform: "translate(0%, -50%)",
                            marginRight: "7px",
                          }}
                        />
                      ))}
                </div>

                {showDisplayName ? (
                  <h2
                    style={{
                      fontSize: "0.95rem",
                      margin: 0,
                      whiteSpace: "nowrap",
                      fontWeight: "400",
                    }}
                  >
                    {data.discord_user.username}
                  </h2>
                ) : null}
                {userStatus && !hideStatus ? (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      margin: 0,
                      color: theme === "dark" ? "#aaa" : "#333",
                      fontWeight: 400,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userStatus.emoji?.id ? (
                      <img
                        src={getImageDataUri(userEmoji)}
                        alt="User Status Emoji"
                        style={{
                          width: "15px",
                          height: "15px",
                          position: "relative",
                          top: "10px",
                          transform: "translate(0%, -50%)",
                          margin: "0 2px 0 0",
                        }}
                      />
                    ) : null}

                    {userStatus.state &&
                    userStatus.emoji?.name &&
                    !userStatus.emoji.id
                      ? `${userStatus.emoji.name} ${userStatus.state}`
                      : userStatus.state
                      ? userStatus.state
                      : !userStatus.state &&
                        userStatus.emoji?.name &&
                        !userStatus.emoji.id
                      ? userStatus.emoji.name
                      : null}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {activities.length > 0 && showActivitySection
            ? activities.map((activity, index) => (
            <div
              key={activity.application_id || index}
              style={{
                display: "flex",
                flexDirection: "row",
                height: `${ACTIVITY_BLOCK_H}px`,
                marginLeft: "15px",
                fontSize: "0.75rem",
                paddingTop: "18px",
              }}
            >
              <div
                style={{
                  marginRight: "15px",
                  width: "auto",
                  height: "auto",
                }}
              >
                {activityImages[index]?.largeImage ? (
                  <img
                    src={getImageDataUri(activityImages[index]?.largeImage)}
                    alt="Activity Large Image"
                    style={{
                      width: "80px",
                      height: "80px",
                      border: "solid 0.5px #222",
                      borderRadius: "10px",
                    }}
                  />
                ) : (
                  <img
                    src={getImageDataUri(
                      theme === "dark" ? UnknownIconLight : UnknownIconDark
                    )}
                    alt="Unknown Icon"
                    style={{
                      width: "70px",
                      height: "70px",
                      marginTop: "4px",
                    }}
                  />
                )}

                {activity.assets?.small_image ? (
                  <img
                    src={getImageDataUri(activityImages[index]?.smallImage)}
                    alt="Activity Small Image"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginLeft: "-26px",
                      marginBottom: "-8px",
                    }}
                  />
                ) : null}
              </div>

              <div
                style={{
                  color: "#999",
                  marginTop:
                    activity.timestamps?.start && !hideTimestamp
                      ? "-6px"
                      : "5px",
                  lineHeight: "1",
                  width: "279px",
                }}
              >
                <p
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    height: "15px",
                    margin: "7px 0",
                  }}
                >
                  {activity.name}
                </p>
                {activity.details ? (
                  <p
                    style={{
                      color: theme === "dark" ? "#ccc" : "#777",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontSize: "0.85rem",
                      textOverflow: "ellipsis",
                      height: "15px",
                      margin: "7px 0",
                    }}
                  >
                    {activity.details}
                  </p>
                ) : null}
                {activity.state ? (
                  <p
                    style={{
                      color: theme === "dark" ? "#ccc" : "#777",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontSize: "0.85rem",
                      textOverflow: "ellipsis",
                      height: "15px",
                      margin: "7px 0",
                    }}
                  >
                    {activity.state}
                    {/* {activity.party?.size
                      ? ` (${activity.party.size[0]} of ${activity.party.size[1]})`
                      : null} */}
                  </p>
                ) : null}
                {activity.timestamps?.start && !hideTimestamp ? (
                  <p
                    style={{
                      color: theme === "dark" ? "#ccc" : "#777",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontSize: "0.85rem",
                      textOverflow: "ellipsis",
                      height: "15px",
                      margin: "7px 0",
                    }}
                  >
                    {elapsedTime(new Date(activity.timestamps.start).getTime())}{" "}
                    elapsed
                  </p>
                ) : null}
              </div>
            </div>
          ))
          : null}
          {data.listening_to_spotify && showActivitySection && !hideSpotify ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "120px",
                marginLeft: "15px",
                fontSize: "0.8rem",
                paddingTop: "18px",
              }}
            >
              <img
                src={getImageDataUri(
                  albumCover ??
                  (theme === "dark" ? UnknownIconLight : UnknownIconDark)
                )}
                alt="Album Cover"
                style={{
                  border: data.spotify.album_art_url
                    ? "border: solid 0.5px #222"
                    : undefined,
                  width: "80px",
                  height: "80px",
                  borderRadius: "10px",
                  marginRight: "15px",
                }}
              />

              <div
                style={{
                  color: "#999",
                  marginTop: "-3px",
                  lineHeight: "1",
                  width: "279px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: theme === "dark" ? "#1CB853" : "#0d943d",
                    marginBottom: "15px",
                    textTransform: "uppercase",
                  }}
                >
                  Listening to Spotify...
                </p>
                <p
                  style={{
                    height: "15px",
                    color: theme === "dark" ? "#fff" : "#000",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    margin: "7px 0",
                  }}
                >
                  {data.spotify.song}
                </p>
                <p
                  style={{
                    margin: "7px 0",
                    height: "15px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    fontSize: "0.85rem",
                    textOverflow: "ellipsis",
                    color: theme === "dark" ? "#ccc" : "#777",
                  }}
                >
                  By {data.spotify.artist.replace(/; /g, ", ")}
                </p>
              </div>
            </div>
          ) : null}
          {showMusicActivity && showActivitySection ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "120px",
                marginLeft: "15px",
                fontSize: "0.8rem",
                paddingTop: "18px",
              }}
            >
              <img
                src={getImageDataUri(
                  albumCover ??
                  (theme === "dark" ? UnknownIconLight : UnknownIconDark)
                )}
                alt="Album Cover"
                style={{
                  border: musicActivity!.assets?.large_image
                    ? "solid 0.5px #222"
                    : undefined,
                  width: "80px",
                  height: "80px",
                  borderRadius: "10px",
                  marginRight: "15px",
                }}
              />

              <div
                style={{
                  color: "#999",
                  marginTop: "-3px",
                  lineHeight: "1",
                  width: "279px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: isAppleMusic
                      ? theme === "dark" ? "#FA243C" : "#d42135"
                      : theme === "dark" ? "#9B59B6" : "#7d3c98",
                    marginBottom: "15px",
                    textTransform: "uppercase",
                  }}
                >
                  Listening to {musicActivity!.name}...
                </p>
                <p
                  style={{
                    height: "15px",
                    color: theme === "dark" ? "#fff" : "#000",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    margin: "7px 0",
                  }}
                >
                  {musicActivity!.details}
                </p>
                <p
                  style={{
                    margin: "7px 0",
                    height: "15px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    fontSize: "0.85rem",
                    textOverflow: "ellipsis",
                    color: theme === "dark" ? "#ccc" : "#777",
                  }}
                >
                  By {musicActivity!.state?.replace(/; /g, ", ")}
                </p>
              </div>
            </div>
          ) : null}
          {showActivitySection &&
          activities.length === 0 &&
          (!data.listening_to_spotify || hideSpotify) &&
          !showMusicActivity ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "150px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "0.8rem",
                  color: theme === "dark" ? "#aaa" : "#444",
                  height: "auto",
                  textAlign: "center",
                }}
              >
                {idleMessage}
              </p>
            </div>
          ) : null}
        </ForeignDiv>
      </foreignObject>
    </svg>
  );
};

export default ProfileCard;
