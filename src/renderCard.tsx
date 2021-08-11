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
    borderRadius?: string;
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
    let avatarBorderColor: string = "#747F8D",
        userStatus: string = "",
        avatarExtension: string = "webp",
        statusExtension: string = "webp",
        activity: any = false,
        backgroundColor: string = "1a1c1f",
        theme = "dark",
        discrim = "show",
        hideStatus = "false",
        hideTimestamp = "false",
        borderRadius = "10px";

    if (body.data.activities[0]?.emoji?.animated) statusExtension = "gif";
    if (body.data.discord_user.avatar && body.data.discord_user.avatar.startsWith("a_")) avatarExtension = "gif";
    if (params.animated === "false") avatarExtension = "webp";
    if (params.hideStatus === "true") hideStatus = "true";
    if (params.hideTimestamp === "true") hideTimestamp = "true";
    if (params.hideDiscrim === "true") discrim = "hide";
    if (params.theme === "light") {
        backgroundColor = "#eee";
        theme = "light";
    }
    if (params.bg) backgroundColor = params.bg;
    if (params.borderRadius) borderRadius = params.borderRadius;

    let avatar: String;
    if (body.data.discord_user.avatar) {
        avatar = await encodeBase64(
            `https://cdn.discordapp.com/avatars/${body.data.discord_user.id}/${
                body.data.discord_user.avatar
            }.${avatarExtension}?size=${avatarExtension === "gif" ? "128" : "256"}`
        );
    } else {
        let lastDigit = Number(body.data.discord_user.discriminator.substr(-1));
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

    switch (body.data.discord_status) {
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

    const flags: string[] = getFlags(body.data.discord_user.public_flags);

    if (body.data.activities[0] && body.data.activities[0].state && body.data.activities[0].type === 4)
        userStatus = body.data.activities[0].state;

    if (body.data.activities[0] && body.data.activities[0].state && body.data.activities[0].type === 4)
        userStatus = body.data.activities[0].state;

    // filter only type 0
    const activities = body.data.activities.filter(activity => activity.type === 0);

    // take the highest one
    activity = Array.isArray(activities) ? activities[0] : activities;

    return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="410px" height="218px">
                <foreignObject x="0" y="0" width="410" height="218">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: 200px;
                        inset: 0;
                        background-color: #${backgroundColor};
                        color: ${theme === "dark" ? "#fff" : "#000"};
                        font-family: 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        font-size: 16px;
                        display: flex;
                        flex-direction: column;
                        padding: 5px;
                        border-radius: ${borderRadius};
                    ">
                        <div style="
                            width: 400px;
                            height: 100px;
                            inset: 0;
                            display: flex;
                            flex-direction: row;
                            padding-bottom: 5px;
                            border-bottom: solid 0.5px ${
                                theme === "dark" ? "hsl(0, 0%, 100%, 10%)" : "hsl(0, 0%, 0%, 10%)"
                            };
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
                                    flex-direction: row;
                                    position: relative;
                                    top: ${userStatus.length > 0 && hideStatus !== "true" ? "35%" : "50%"};
                                    transform: translate(0, -50%);
                                    height: 25px;
                                ">
                                    <h1 style="
                                        font-size: 1.15rem;
                                        margin: 0 5px 0 0;
                                    ">
                                    ${escape(body.data.discord_user.username)}${
        discrim !== "hide"
            ? `<span style="color: ${theme === "dark" ? "#ccc" : "#666"}; font-weight: lighter;">#${
                  body.data.discord_user.discriminator
              }</span>`
            : ""
    }
                                    </h1>

                                    ${flags
                                        .map(
                                            v => `
                                        <img src="data:image/png;base64,${Badges[v]}" style="
                                            width: 20px;
                                            height: 20px;
                                            position: relative;
                                            top: 50%;
                                            transform: translate(0%, -50%);
                                            margin: 0 0 0 4px;
                                        " />`
                                        )
                                        .join("")}
                                </div>
                                ${
                                    userStatus.length > 0 && hideStatus !== "true"
                                        ? `
                                    <h1 style="
                                        font-size: 0.9rem;
                                        margin-top: 16px;
                                        color: ${theme === "dark" ? "#aaa" : "#333"};
                                        font-weight: lighter;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                    ">
                                    ${
                                        body.data.activities[0].emoji && body.data.activities[0].emoji.id
                                            ? `
                                        <img src="data:image/png;base64,${await encodeBase64(
                                            `https://cdn.discordapp.com/emojis/${body.data.activities[0].emoji.id}.${statusExtension}`
                                        )}"
                                        style="
                                            width: 15px;
                                            height: 15px;
                                            position: relative;
                                            top: 10px;
                                            transform: translate(0%, -50%);
                                            margin: 0 2px 0 0;
                                        " />`
                                            : ``
                                    }
                                    ${
                                        body.data.activities[0].emoji && !body.data.activities[0].emoji.id
                                            ? body.data.activities[0].emoji.name + " " + escape(userStatus)
                                            : escape(userStatus)
                                    }
                                </h1>`
                                        : ``
                                }
                            </div>
                        </div>

                        ${
                            activity
                                ? `
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 120px;
                                margin-left: 15px;
                                font-size: 0.75rem;
                                padding-top: 18px;
                            ">
                                <div style="
                                    margin-right: 15px;
                                    width: auto;
                                    height: auto;
                                ">
                                ${
                                    activity.assets && activity.assets.large_image
                                        ? `
                                    <img src="data:image/png;base64,${await encodeBase64(
                                        `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`
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
                                        `https://lanyard-profile-readme.vercel.app/assets/unknown.png`
                                    )}" style="
                                        width: 70px;
                                        height: 70px;
                                        margin-top: 4px;
                                        filter: invert(100);
                                    "/>
                                `
                                }
                                ${
                                    activity.assets && activity.assets.small_image
                                        ? `
                                    <img src="data:image/png;base64,${await encodeBase64(
                                        `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`
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
                                    margin-top: -3px;
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
                                    ">${activity.name}</p>
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
                                        ">${activity.details}</p>`
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
                                        ">${activity.state}${
                                                  activity.party
                                                      ? `(${activity.party.size[0]} of ${activity.party.size[1]})`
                                                      : ""
                                              }</p>`
                                            : ``
                                    }
                                    ${
                                        activity.timestamps && hideTimestamp !== "true"
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
                body.data.listening_to_spotify === true &&
                body.data.activities[Object.keys(body.data.activities).length - 1].type === 2
                    ? `
                <div style="
                    display: flex;
                    flex-direction: row;
                    height: 120px;
                    margin-left: 15px;
                    font-size: 0.8rem;
                    padding-top: 18px;
                ">
                    <img src="data:image/png;base64,${await encodeBase64(body.data.spotify.album_art_url)}" style="
                        width: 80px;
                        height: 80px;
                        border: solid 0.5px #222;
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
                            theme === "dark" ? "#1CB853" : "#0d943d"
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
                        ">${escape(body.data.spotify.song)}</p>
                        <p style="
                            margin: 7px 0;
                            height: 15px;
                            overflow: hidden;
                            white-space: nowrap;
                            font-size: 0.85rem;
                            text-overflow: ellipsis;
                            color: ${theme === "dark" ? "#ccc" : "#777"};
                        ">By ${escape(body.data.spotify.artist)}</p>
                    </div>
                </div>
            `
                    : ``
            }
            ${
                !activity && body.data.listening_to_spotify === false
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
                    ">
                        I'm not currently doing anything!
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
