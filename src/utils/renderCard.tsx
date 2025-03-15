"use server";

import { Badges } from "#/public/assets/badges/BadgesEncoded";
import { getFlags, renderToStaticMarkup } from "@/utils/helpers";
import * as LanyardTypes from "@/utils/LanyardTypes";
import { encodeBase64 } from "@/utils/toBase64";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export type Parameters = {
  theme?: string;
  bg?: string;
  clanbg?: string;
  animated?: string;
  animatedDecoration?: string;
  hideDiscrim?: string;
  hideStatus?: string;
  hideTimestamp?: string;
  hideBadges?: string;
  hideProfile?: string;
  hideActivity?: string;
  hideSpotify?: string;
  hideClan?: string;
  hideDecoration?: string;
  ignoreAppId?: string;
  showDisplayName?: string;
  borderRadius?: string;
  idleMessage?: string;
  optimized: boolean;
};

const parseBool = (string: string | undefined): boolean => (string === "true" ? true : false);

const parseAppId = (string: string | undefined): Array<string> => {
  if (string === undefined) return [];
  return string.split(",");
};

const elapsedTime = (timestamp: any): string => {
  let startTime = timestamp;
  let endTime = Number(new Date());
  let difference = (endTime - startTime) / 1000;

  // we only calculate them, but we don't display them.
  // this fixes a bug in the Discord API that does not send the correct timestamp to presence.
  let daysDifference = Math.floor(difference / 60 / 60 / 24);
  difference -= daysDifference * 60 * 60 * 24;

  let hoursDifference = Math.floor(difference / 60 / 60);
  difference -= hoursDifference * 60 * 60;

  let minutesDifference = Math.floor(difference / 60);
  difference -= minutesDifference * 60;

  let secondsDifference = Math.floor(difference);

  return `${hoursDifference >= 1 ? ("0" + hoursDifference).slice(-2) + ":" : ""}${("0" + minutesDifference).slice(
    -2,
  )}:${("0" + secondsDifference).slice(-2)}`;
};

async function renderCard(body: LanyardTypes.Root, params: Parameters): Promise<string> {
  let { data } = body;

  let avatarBorderColor: string = "#747F8D",
    avatarExtension: string = "webp",
    statusExtension: string = "webp",
    activity: any = false,
    backgroundColor: string = "1a1c1f",
    theme = "dark",
    borderRadius = "10px",
    idleMessage = "I'm not currently doing anything!";

  let hideStatus = parseBool(params.hideStatus);
  let hideTimestamp = parseBool(params.hideTimestamp);
  let hideBadges = parseBool(params.hideBadges);
  let hideProfile = parseBool(params.hideProfile);
  let hideActivity = params.hideActivity ?? "false";
  let hideSpotify = parseBool(params.hideSpotify);
  let hideClan = parseBool(params.hideClan);
  let hideDecoration = parseBool(params.hideDecoration);
  let ignoreAppId = parseAppId(params.ignoreAppId);
  let hideDiscrim = parseBool(params.hideDiscrim);
  let showDisplayName = parseBool(params.showDisplayName);

  if (!data.discord_user.avatar_decoration_data) hideDecoration = true;
  if (parseBool(params.hideDiscrim) || body.data.discord_user.discriminator === "0") hideDiscrim = true;
  if (!body.data.discord_user.clan) hideClan = true;
  if (data.activities[0]?.emoji?.animated && !params.optimized) statusExtension = "gif";
  if (data.discord_user.avatar && data.discord_user.avatar.startsWith("a_") && !params.optimized)
    avatarExtension = "gif";
  if (params.animated === "false") avatarExtension = "webp";
  if (params.theme === "light") {
    backgroundColor = "eee";
    theme = "light";
  }
  if (params.bg) backgroundColor = params.bg;
  let clanBackgroundColor: string = theme === "light" ? "#e0dede" : "#111214";
  if (params.clanbg) clanBackgroundColor = params.clanbg;
  if (params.idleMessage) idleMessage = params.idleMessage;
  if (params.borderRadius) borderRadius = params.borderRadius;

  let avatar: string;
  if (data.discord_user.avatar) {
    avatar = await encodeBase64(
      `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${
        data.discord_user.avatar
      }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`,
      avatarExtension === "gif" ? 64 : 128,
    );
  } else {
    avatar = await encodeBase64(
      `https://cdn.discordapp.com/embed/avatars/${
        data.discord_user.discriminator === "0"
          ? Number(BigInt(data.discord_user.id) >> BigInt(22)) % 6
          : Number(data.discord_user.discriminator) % 5
      }.png`,
      100,
    );
  }

  let clanBadge: string | null = null;
  if (data.discord_user.clan && data.discord_user.clan.identity_guild_id && data.discord_user.clan.badge) {
    clanBadge = await encodeBase64(
      `https://cdn.discordapp.com/clan-badges/${data.discord_user.clan.identity_guild_id}/${data.discord_user.clan.badge}.png?size=16`,
      16,
    );
  }

  let avatarDecoration: string | null = null;
  if (data.discord_user.avatar_decoration_data?.asset) {
    avatarDecoration = await encodeBase64(
      `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=64&passthrough=${params.animatedDecoration || "false"}`,
      100,
      false,
    );
  }

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

  let flags: string[] = getFlags(data.discord_user.public_flags);
  if (data.discord_user.avatar && data.discord_user.avatar.includes("a_")) flags.push("Nitro");

  let userStatus: Record<string, any> | null = null;
  if (data.activities[0] && data.activities[0].type === 4) userStatus = data.activities[0];

  const activities = data.activities
    // Filter only type 0
    .filter(activity => activity.type === 0)
    // Filter ignored app ID
    .filter(activity => !ignoreAppId.includes(activity.application_id ?? ""));

  // Take the highest one
  activity = Array.isArray(activities) ? activities[0] : activities;

  // Calculate height of parent SVG element
  const svgHeight = (): string => {
    if (hideProfile) return "130";
    if (hideActivity === "true") return "91";
    if (hideActivity === "whenNotUsed" && !activity && !data.listening_to_spotify) return "91";
    if (hideSpotify && data.listening_to_spotify) return "210";
    return "210";
  };

  // Calculate height of main div element
  const divHeight = (): string => {
    if (hideProfile) return "120";
    if (hideActivity === "true") return "81";
    if (hideActivity === "whenNotUsed" && !activity && !data.listening_to_spotify) return "81";
    if (hideSpotify && data.listening_to_spotify) return "200";
    return "200";
  };

  const ForeignDiv = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { xmlns: string }) => (
    <div {...props}>{props.children}</div>
  );

  const renderedSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="410px" height={svgHeight()}>
      <defs>
        <style>
          {`.hover-opacity:hover {
                            opacity: 0.25;
                        }

                        .transition {
                            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                            transition-duration: 200ms;
                        }`}
        </style>
      </defs>
      <foreignObject x="0" y="0" width="410" height={svgHeight()}>
        <ForeignDiv
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            position: "absolute",
            width: "400px",
            height: `${divHeight()}px`,
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
                  hideActivity !== "false" && !activity && !data.listening_to_spotify
                    ? ""
                    : `solid 0.5px ${theme === "dark" ? "hsl(0, 0%, 100%, 10%)" : "hsl(0, 0%, 0%, 10%)"}`,
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

                {hideDecoration || !data.discord_user.avatar_decoration_data ? null : (
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
                      className="hover-opacity transition"
                    />

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
                  </>
                )}
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
                      <span style={{ color: theme === "dark" ? "#ccc" : "#666", fontWeight: "lighter" }}>
                        #{data.discord_user.discriminator}
                      </span>
                    ) : null}
                  </h1>

                  {hideClan || (!data.discord_user.clan?.tag && !data.discord_user.clan?.badge) ? null : (
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
                      <img src={`data:image/png;base64,${clanBadge!}`} alt="Clan Badge" />
                      <p style={{ marginBottom: "1.1rem", whiteSpace: "nowrap" }}>{data.discord_user.clan!.tag}</p>
                    </span>
                  )}

                  {!!hideBadges
                    ? null
                    : flags.map(v => (
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
                        src={`data:image/png;base64,${await encodeBase64(
                          `https://cdn.discordapp.com/emojis/${userStatus.emoji.id}.${statusExtension}`,
                          32,
                        )}`}
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

                    {userStatus.state && userStatus.emoji?.name && !userStatus.emoji.id
                      ? `${userStatus.emoji.name} ${userStatus.state}`
                      : userStatus.state
                        ? userStatus.state
                        : !userStatus.state && userStatus.emoji?.name && !userStatus.emoji.id
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
                    src={`data:image/png;base64,${await encodeBase64(
                      activity.assets.large_image.startsWith("mp:external/")
                        ? `https://media.discordapp.net/external/${activity.assets.large_image.replace("mp:external/", "")}`
                        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`,
                      196,
                    )}`}
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
                    src={`data:image/png;base64,${await encodeBase64(
                      `https://lanyard-profile-readme.vercel.app/assets/unknown.png`,
                      64,
                    )}`}
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
                    src={`data:image/png;base64,${await encodeBase64(
                      activity.assets.small_image.startsWith("mp:external/")
                        ? `https://media.discordapp.net/external/${activity.assets.small_image.replace("mp:external/", "")}`
                        : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`,
                      64,
                    )}`}
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
                  marginTop: activity.timestamps?.start && !hideTimestamp ? "-6px" : "5px",
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
                    {activity.party?.size ? ` (${activity.party.size[0]} of ${activity.party.size[1]})` : null}
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
                    {elapsedTime(new Date(activity.timestamps.start).getTime())} elapsed
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
          {data.listening_to_spotify &&
          !activity &&
          !hideSpotify &&
          data.activities[Object.keys(data.activities).length - 1].type === 2 ? (
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
                src={await (async () => {
                  const album = await encodeBase64(data.spotify.album_art_url, 196);
                  if (album) return `data:image/png;base64,${album}`;
                  return "https://lanyard-profile-readme.vercel.app/assets/unknown.png";
                })()}
                alt="Album Cover"
                style={{
                  border: data.spotify.album_art_url ? "border: solid 0.5px #222" : undefined,
                  filter: !data.spotify.album_art_url ? "invert(100)" : undefined,
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
          {!activity && (!data.listening_to_spotify || hideSpotify) && hideActivity === "false" ? (
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

  return renderToStaticMarkup(renderedSVG);
}

export default renderCard;
