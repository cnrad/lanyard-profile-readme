//probably the messiest code i've ever written but it works so :)

import { Badges } from "../public/assets/badges/BadgesEncoded";
import { getFlags } from "./getFlags";
import * as LanyardTypes from "./LanyardTypes";
import { encodeBase64 } from "./toBase64";
import { blue, green, gray, gold, red } from "./defaultAvatars";
import escape from "escape-html";

type Parameters = {
    theme?: string;
    bg?: string;
    animated?: string;
    hideDiscrim?: string;
    hideStatus?: string;
    hideTimestamp?: string;
    hideBadges?: string;
    hideProfile?: string;
    borderRadius?: string;
    idleMessage?: string;
};

const elapsedTime = (timestamp: any) => {
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
        -2
    )}:${("0" + secondsDifference).slice(-2)}`;
};

const renderCard = async (body: LanyardTypes.Root, params: Parameters): Promise<string> => {
    let { data } = body;

    let avatarBorderColor: string = "#747F8D",
        avatarExtension: string = "webp",
        statusExtension: string = "webp",
        activity: any = false,
        backgroundColor: string = "1a1c1f",
        theme = "dark",
        discrim = "show",
        hideStatus = "false",
        hideTimestamp = "false",
        hideBadges = "false",
        hideProfile = "false",
        borderRadius = "10px",
        idleMessage = "I'm not currently doing anything!";

    if (data.activities[0]?.emoji?.animated) statusExtension = "gif";
    if (data.discord_user.avatar && data.discord_user.avatar.startsWith("a_")) avatarExtension = "gif";
    if (params.animated === "false") avatarExtension = "webp";
    if (params.hideStatus === "true") hideStatus = "true";
    if (params.hideTimestamp === "true") hideTimestamp = "true";
    if (params.hideBadges === "true") hideBadges = "true";
    if (params.hideDiscrim === "true") discrim = "hide";
    if (params.hideProfile === "true") hideProfile = "true";
    if (params.theme === "light") {
        backgroundColor = "#eee";
        theme = "light";
    }
    if (params.bg) backgroundColor = params.bg;
    if (params.idleMessage) idleMessage = params.idleMessage;
    if (params.borderRadius) borderRadius = params.borderRadius;

    let avatar: String;
    if (data.discord_user.avatar) {
        avatar = await encodeBase64(
            `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${
                data.discord_user.avatar
            }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`
        );
    } else {
        let lastDigit = Number(data.discord_user.discriminator.substr(-1));
        if (lastDigit >= 5) {
            lastDigit -= 5;
        }
        // the default avatar that discord uses depends on the last digit of the user's discriminator
        switch (lastDigit) {
            case 1:
                avatar = gray;
                break;
            case 2:
                avatar = green;
                break;
            case 3:
                avatar = gold;
                break;
            case 4:
                avatar = red;
                break;
            default:
                avatar = blue;
        }
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

    let userStatus: Record<string, any> | null = null;
    if (data.activities[0] && data.activities[0].type === 4) userStatus = data.activities[0];

    let flags: string[] = getFlags(data.discord_user.public_flags);
    if ((data.discord_user.avatar && data.discord_user.avatar.includes("a_")) || userStatus?.emoji?.id)
        flags.push("Nitro");

    // Filter only type 0
    const activities = data.activities.filter(activity => activity.type === 0);

    // Take the highest one
    activity = Array.isArray(activities) ? activities[0] : activities;

    return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="400px" height="${
                hideProfile === "true" ? "120px" : "200px"
            }">
                <style>
                    .status::before {
                        content: "";
                        position: absolute;
                        height: 21px;
                        width: 100%;
                        top: -21px;
                        left: 0;
                        background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjIxIiB2aWV3Qm94PSIwIDAgMzYwIDIxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAyMC43MzI3VjcuNTgxN0MwIDcuNTgxNyA0Ny41MzEyIC0xLjQ2OTMyIDEwNi43MzQgMS4yMzgyNEMxNjkuMzEyIDIuMzk4NjMgMTkxLjY3MiAxMy42NTA4IDI3MS45NjkgMTQuNTQ0QzMyNS44MjggMTQuNTQ0IDM2MCA3LjczNjQyIDM2MCA3LjczNjQyVjIwLjczMjdIMFoiIGZpbGw9IiMxRTIyMzMiLz4KPC9zdmc+Cg==")
                        background-size: 100% 21px;
                        -webkit-animation: animate2 4s linear infinite;
                        animation: animate2 4s linear infinite;
                        -webkit-animation-delay: 0s;
                        animation-delay: 0s;
                    }
                    @-webkit-keyframes animate2 {
                        0% {
                        background-position-x: 360px;
                        }
                        100% {
                        background-position-x: 0;
                        }
                    }
                    @keyframes animate2 {
                        0% {
                        background-position-x: 360px;
                        }
                        100% {
                        background-position-x: 0;
                        }
                    }
                </style>
                <foreignObject x="0" y="0" width="400" height="${hideProfile === "true" ? "120" : "200"}">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: ${hideProfile === "true" ? "120px" : "200px"};
                        inset: 0;
                        background-color: #${backgroundColor};
                        color: ${theme === "dark" ? "#fff" : "#000"};
                        font-family: 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        font-size: 16px;
                        display: flex;
                        flex-direction: column;
                        border-radius: ${borderRadius};
                    ">

                    ${
                        hideProfile === "true"
                            ? ""
                            : `
                        <div style="
                            width: 400px;
                            height: 100px;
                            inset: 0;
                            display: flex;
                            flex-direction: row;
                            padding-bottom: 5px;
                        ">
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 80px;
                                width: 80px;
                            ">
                                <img src="data:image/png;base64,${avatar}"
                                style="
                                    border: solid 3px ${avatarBorderColor};
                                    border-radius: 50%;
                                    width: 50px;
                                    height: 50px;
                                    position: relative;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                "/>
                            </div>
                            <div style="
                                height: 80px;
                                width: 260px;
                            ">
                                <div style="
                                    display: flex;
                                    flex-direction: ${userStatus && hideStatus !== "true" ? "row" : "column"};
                                    position: relative;
                                    top: ${userStatus && hideStatus !== "true" ? "35%" : "40%"};
                                    transform: translate(0, -50%);
                                    height: ${userStatus && hideStatus !== "true" ? "25px" : "35px"};
                                ">
                                    <h1 style="
                                        font-size: 1.15rem;
                                        margin: 0 12px 0 0;
                                        white-space: nowrap;
                                    ">
                                    ${`<span style="background-image: linear-gradient(60deg, #ccf9ff, #7ce8ff, #55d0ff, #00acdf, #0080bf, #00acdf, #55d0ff, #7ce8ff, #ccf9ff); background-size: 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${escape(
                                        data.discord_user.username
                                    )}</span>`}${
                                  discrim !== "hide"
                                      ? `<span style="color: ${
                                            theme === "dark" ? "#ccc" : "#666"
                                        }; font-weight: lighter;">#${data.discord_user.discriminator}</span>`
                                      : ""
                              }
                                    </h1>
                                    ${
                                        hideBadges == "true"
                                            ? ""
                                            : `<div style="${
                                                  userStatus && hideStatus !== "true" ? "" : "margin-top:5px;"
                                              }">
                                                ${flags
                                                    .map(
                                                        v => `
                                                    <img src="data:image/png;base64,${Badges[v]}" style="
                                                        height: 20px;
                                                        position: relative;
                                                        top: 50%;
                                                        transform: translate(0%, -50%);
                                                        margin: 0 0 0 4px;
                                                    " />`
                                                    )
                                                    .join("")}
                                                </div>`
                                    }
                                </div>
                                ${
                                    userStatus && hideStatus !== "true"
                                        ? `
                                    <h1 style="
                                        font-size: 0.9rem;
                                        margin-top: 16px;
                                        color: ${theme === "dark" ? "#aaa" : "#333"};
                                        font-weight: 400;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                    ">
                                    ${
                                        userStatus.emoji?.id
                                            ? `
                                        <img src="data:image/png;base64,${await encodeBase64(
                                            `https://cdn.discordapp.com/emojis/${userStatus.emoji.id}.${statusExtension}`
                                        )}"
                                        style="
                                            width: 15px;
                                            height: 15px;
                                            position: relative;
                                            top: 10px;
                                            transform: translate(0%, -50%);
                                            margin: 0 2px 0 0;
                                        " />`
                                            : ""
                                    }
                                    ${
                                        userStatus.state && userStatus.emoji?.name && !userStatus.emoji.id
                                            ? `${userStatus.emoji.name} ${escape(userStatus.state)}`
                                            : userStatus.state
                                            ? escape(userStatus.state)
                                            : userStatus.emoji?.name && !userStatus.emoji.id
                                            ? escape(userStatus.emoji.name)
                                            : ""
                                    }
                                </h1>`
                                        : ``
                                }
                            </div>
                        </div>`
                    }

                        ${
                            activity
                                ? `
                            <div classname="status" style="
                                display: flex;
                                flex-direction: row;
                                background-color: #7289da;
                                border-radius: 0 0 ${borderRadius} ${borderRadius};
                                height: 120px;
                                font-size: 0.75rem;
                                padding: 0 0 0 15px;
                            ">
                                <div style="
                                    margin-right: 15px;
                                    width: auto;
                                    height: auto;
                                ">
                                    ${
                                        activity.assets?.large_image
                                            ? `
                                        <img src="data:image/png;base64,${await encodeBase64(
                                            activity.assets.large_image.startsWith("mp:external/")
                                                ? `https://media.discordapp.net/external/${activity.assets.large_image.replace(
                                                      "mp:external/",
                                                      ""
                                                  )}`
                                                : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`
                                        )}"
                                        style="
                                            width: 80px;
                                            height: 80px;
                                            border: solid 0.5px #222;
                                            border-radius: 10px;
                                        "/>
                                    `
                                            : `
                                    <img src="data:image/png;base64,${await encodeBase64(
                                        `https://lanyard.kyrie25.me/assets/unknown.png`
                                    )}" style="
                                        width: 70px;
                                        height: 70px;
                                        margin-top: 4px;
                                        filter: invert(100);
                                    "/>
                                `
                                    }
                                ${
                                    activity.assets?.small_image
                                        ? `
                                    <img src="data:image/png;base64,${await encodeBase64(
                                        activity.assets.small_image.startsWith("mp:external/")
                                            ? `https://media.discordapp.net/external/${activity.assets.small_image.replace(
                                                  "mp:external/",
                                                  ""
                                              )}`
                                            : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`
                                    )}"
                                    style="
                                        width: 30px;
                                        height: 30px;
                                        border-radius: 50%;
                                        margin-left: -26px;
                                        margin-bottom: -8px;
                                    "/>`
                                        : ``
                                }
                                </div>
                                <div style="
                                    color: #999;
                                    margin-top: ${
                                        activity.timestamps?.start && hideTimestamp !== "true" ? "-6px" : "5px"
                                    };
                                    line-height: 1;
                                    width: 279px;
                                ">
                                    <p style="
                                        color: ${theme === "dark" ? "#fff" : "#000"};
                                        font-size: 0.85rem;
                                        font-weight: bold;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        height: 15px;
                                        margin: 7px 0;
                                    ">${escape(activity.name)}</p>
                                        ${
                                            activity.details
                                                ? `
                                            <p style="
                                                color: ${theme === "dark" ? "#ccc" : "#777"};
                                                overflow: hidden;
                                                white-space: nowrap;
                                                font-size: 0.85rem;
                                                text-overflow: ellipsis;
                                                height: 15px;
                                                margin: 7px 0;
                                            ">${escape(activity.details)}</p>`
                                                : ``
                                        }
                                        ${
                                            activity.state
                                                ? `
                                            <p style="
                                                color: ${theme === "dark" ? "#ccc" : "#777"};
                                                overflow: hidden;
                                                white-space: nowrap;
                                                font-size: 0.85rem;
                                                text-overflow: ellipsis;
                                                height: 15px;
                                                margin: 7px 0;
                                            ">${escape(activity.state)}${
                                                      activity.party?.size
                                                          ? ` (${activity.party.size[0]} of ${activity.party.size[1]})`
                                                          : ""
                                                  }</p>`
                                                : ``
                                        }
                                        ${
                                            activity.timestamps?.start && hideTimestamp !== "true"
                                                ? `
                                            <p style="
                                                color: ${theme === "dark" ? "#ccc" : "#777"};
                                                overflow: hidden;
                                                white-space: nowrap;
                                                font-size: 0.85rem;
                                                text-overflow: ellipsis;
                                                height: 15px;
                                                margin: 7px 0;
                                            ">${elapsedTime(new Date(activity.timestamps.start).getTime())} elapsed</p>`
                                                : ``
                                        }
                                </div>
                            </div>
                            `
                                : ``
                        }

            ${
                data.listening_to_spotify === true &&
                !activity &&
                data.activities[Object.keys(data.activities).length - 1].type === 2
                    ? `
                <svg xmlns="http://www.w3.org/2000/svg" style="overflow: visible;" fill="none" viewBox="0 0 294 20" height="21" width="400" preserveAspectRatio="none">
                    <path d="M0 21V7.19143C0 7.19143 38.8172 -2.31216 87.1664 0.530784C138.272 1.7492 156.532 13.564 222.108 14.5019C266.093 14.5019 294 7.35388 294 7.35388V21H0Z" fill="#1DB954"/>
                </svg>
                <div style="
                    display: flex;
                    flex-direction: row;
                    height: 120px;
                    font-size: 0.8rem;
                    padding-left: 18px;
                    background-color: #1DB954;
                    border-radius: 0 0 ${borderRadius} ${borderRadius};
                ">
                    <img src="${await (async () => {
                        const album = await encodeBase64(data.spotify.album_art_url);
                        if (album) return `data:image/png;base64,${album}" style="border: solid 0.5px #222;`;
                        return 'https://lanyard.kyrie25.me/assets/unknown.png" style="filter: invert(100);';
                    })()}
                        width: 80px;
                        height: 80px;
                        border-radius: 10px;
                        margin-right: 15px;
                    "/>

                    <div style="
                        color: #999;
                        margin-top: -3px;
                        line-height: 1;
                        width: 279px;
                    ">
                        <p style="font-size: 0.75rem; font-weight: bold; color: ${
                            theme === "dark" ? "#ddd8d8" : "#0d943d"
                        }; margin-bottom: 15px;">LISTENING TO SPOTIFY...</p>
                        <p style="
                            height: 15px;
                            color: ${theme === "dark" ? "#fff" : "#000"};
                            font-weight: bold;
                            font-size: 0.85rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            margin: 7px 0;
                        ">${escape(data.spotify.song)}</p>
                        <p style="
                            margin: 7px 0;
                            height: 15px;
                            overflow: hidden;
                            white-space: nowrap;
                            font-size: 0.85rem;
                            text-overflow: ellipsis;
                            color: ${theme === "dark" ? "#ccc" : "#777"};
                        ">By ${escape(data.spotify.artist)}</p>
                    </div>
                </div>
            `
                    : ``
            }
            ${
                !activity && data.listening_to_spotify === false
                    ? `<div style="
                    display: flex;
                    flex-direction: row;
                    height: 150px;
                    justify-content: center;
                    align-items: center;
                ">
                    <p style="
                        font-style: italic;
                        font-size: 0.8rem;
                        color: ${theme === "dark" ? "#aaa" : "#444"};
                        height: auto;
                        text-align: center;
                    ">
                        ${escape(idleMessage)}
                    </p>
                </div>`
                    : ``
            }

                    </div>
                </foreignObject>
            </svg>
        `;
};

export default renderCard;
