import { Activity, Data } from "@/utils/LanyardTypes";
import { Badges, UnknownIcon } from "@/utils/badges";
import { elapsedTime, getFlags } from "@/utils/helpers";
import { ProfileSettings } from "@/utils/parameters";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

interface ProfileCardProps {
  settings: ProfileSettings;
  data: Data;
  images: {
    avatar: string | null;
    avatarDecoration: string | null;
    clanBadge: string | null;
    assetLargeImage: string | null;
    assetSmallImage: string | null;
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
    assetLargeImage,
    assetSmallImage,
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
  const activity: Activity | undefined =
    activities.length > 0 ? activities[0] : undefined;

  const width = "410px";
  const height = (() => {
    if (hideProfile) return "130";
    if (hideActivity === true) return "91";
    if (
      hideActivity === "whenNotUsed" &&
      !activity &&
      !data.listening_to_spotify
    )
      return "91";
    if (hideSpotify && data.listening_to_spotify) return "210";
    return "210";
  })();

  // Calculate height of main div element
  const divHeight = (() => {
    if (hideProfile) return "120";
    if (hideActivity === true) return "81";
    if (
      hideActivity === "whenNotUsed" &&
      !activity &&
      !data.listening_to_spotify
    )
      return "81";
    if (hideSpotify && data.listening_to_spotify) return "200";
    return "200";
  })();

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
                borderBottom:
                  hideActivity && !activity && !data.listening_to_spotify
                    ? ""
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
                  src={`data:image/png;base64,${avatar}`}
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
                      src={`data:image/webp;base64,${avatarDecoration!}`}
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
                  (!data.discord_user.clan?.tag &&
                    !data.discord_user.clan?.badge) ? null : (
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
                        src={`data:image/png;base64,${clanBadge!}`}
                        alt="Clan Badge"
                      />
                      <p
                        style={{ marginBottom: "1.1rem", whiteSpace: "nowrap" }}
                      >
                        {data.discord_user.clan!.tag}
                      </p>
                    </span>
                  )}

                  {!!hideBadges
                    ? null
                    : flags.map((v) => (
                        <img
                          key={v}
                          alt={v}
                          src={`data:image/png;base64,${Badges[v]}`}
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
                        src={`data:image/png;base64,${userEmoji}`}
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

          {activity ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "120px",
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
                {activity.assets?.large_image ? (
                  <img
                    src={`data:image/png;base64,${assetLargeImage}`}
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
                    src={`data:image/png;base64,${UnknownIcon}`}
                    alt="Unknown Icon"
                    style={{
                      width: "70px",
                      height: "70px",
                      marginTop: "4px",
                      filter: "invert(100)",
                    }}
                  />
                )}

                {activity.assets?.small_image ? (
                  <img
                    src={`data:image/png;base64,${assetSmallImage}`}
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
          ) : null}
          {data.listening_to_spotify &&
          !activity &&
          !hideSpotify &&
          data.activities[Object.keys(data.activities).length - 1].type ===
            2 ? (
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
                src={`data:image/png;base64,${albumCover ?? UnknownIcon}`}
                alt="Album Cover"
                style={{
                  border: data.spotify.album_art_url
                    ? "border: solid 0.5px #222"
                    : undefined,
                  filter: !data.spotify.album_art_url
                    ? "invert(100)"
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
                  }}
                >
                  LISTENING TO SPOTIFY...
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
                  By {data.spotify.artist}
                </p>
              </div>
            </div>
          ) : null}
          {!activity &&
          (!data.listening_to_spotify || hideSpotify) &&
          !hideActivity ? (
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
