// probably the messiest code i've ever written but it works so :)

import { Badges } from "../public/assets/badges/BadgesEncoded";
import { getFlags } from "./getFlags";
import * as LanyardTypes from "./LanyardTypes";
import { encodeBase64 } from "./toBase64";
import escape from "escape-html";

type Parameters = {
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
};

const parseBool = (string: string | undefined): boolean => string === "true" ? true : false;

const parseAppId = (string: string | undefined): Array<string> => {
    if (string === undefined) return [];
    return string.split(",");
}

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
    if (data.activities[0]?.emoji?.animated) statusExtension = "gif";
    if (data.discord_user.avatar && data.discord_user.avatar.startsWith("a_")) avatarExtension = "gif";
    if (params.animated === "false") avatarExtension = "webp";
    if (params.theme === "light") {
        backgroundColor = "#eee";
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
            }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`
        );
    } else {
        avatar = await encodeBase64(
            `https://cdn.discordapp.com/embed/avatars/${data.discord_user.discriminator === "0" 
                ? ((Number(BigInt(data.discord_user.id) >> BigInt(22))) % 6) 
                : Number(data.discord_user.discriminator) % 5}.png`
        );
    }

    let clanBadge: string;
    if (data.discord_user.clan) {
        clanBadge = await encodeBase64(
            `https://cdn.discordapp.com/clan-badges/${data.discord_user.clan.identity_guild_id}/${data.discord_user.clan.badge}.png?size=16`
        );
    }

    let avatarDecoration: string;
    if (data.discord_user.avatar_decoration_data) {
        avatarDecoration = await encodeBase64(
            `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=64&passthrough=${params.animatedDecoration || "true"}`
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
    }

    // Calculate height of main div element
    const divHeight = (): string => {
        if (hideProfile) return "120";
        if (hideActivity === "true") return "81";
        if (hideActivity === "whenNotUsed" && !activity && !data.listening_to_spotify) return "81";
        if (hideSpotify && data.listening_to_spotify) return "200";
        return "200";
    }

    return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="410px" height="${svgHeight()}px">
                <defs>
                    <style>
                        .hover-opacity:hover {
                            opacity: 0.25;
                        }

                        .transition {
                            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                            transition-duration: 200ms;
                        }
                    </style>
                </defs>
                <foreignObject x="0" y="0" width="410" height="${svgHeight()}">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: ${divHeight()}px;
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
                    
                    ${
                        hideProfile ? "" : `
                        <div style="
                            width: 400px;
                            height: 100px;
                            inset: 0;
                            display: flex;
                            flex-direction: row;
                            padding-bottom: 5px;
                            ${hideActivity !== "false" && !activity && !data.listening_to_spotify ?
                                ""
                                : `border-bottom: solid 0.5px ${theme === "dark" ?
                                    "hsl(0, 0%, 100%, 10%)"
                                    : "hsl(0, 0%, 0%, 10%)"
                                }`
                            }
                        ">
                            <div style="
                                display: flex;
                                position: relative;
                                flex-direction: row;
                                height: 80px;
                                width: 80px;
                            ">
                                <img src="data:image/png;base64,${avatar}"
                                style="
                                    border-radius: 50%;
                                    width: 50px;
                                    height: 50px;
                                    position: relative;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                "/>
                                ${hideDecoration || !data.discord_user.avatar_decoration_data ? "" : `
                                <img src="data:image/png;base64,${avatarDecoration!}"
                                class="hover-opacity transition"
                                style="
                                    display: block;
                                    width: 64px;
                                    height: 64px;
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                "/>
                                `}
                                <span style="
                                    position: absolute;
                                    bottom: 14px;
                                    right: 14px;
                                    height: 13px;
                                    width: 13px;
                                    background-color: ${avatarBorderColor};
                                    border-radius: 50%;
                                    border: 3px solid #${backgroundColor};
                                " />
                            </div>
                            <div style="
                                height: 80px;
                                width: 260px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                            ">
                                <div style="
                                    display: flex;
                                    flex-direction: row;
                                    height: 25px;
                                ">
                                    <h1 style="
                                        font-size: 1.15rem;
                                        margin: 0 12px 0 0;
                                        white-space: nowrap;
                                    ">
                                        ${escape(showDisplayName ? data.discord_user.global_name : data.discord_user.username)}${
                                            !hideDiscrim && !showDisplayName
                                                ? `<span style="color: ${theme === "dark" ? "#ccc" : "#666"}; font-weight: lighter;">#${
                                                    data.discord_user.discriminator
                                                }</span>`
                                                : ""
                                        }
                                    </h1>

                                    ${hideClan || !data.discord_user.clan?.tag && !data.discord_user.clan?.badge ? "" : `
                                        <span style="
                                            background-color: ${clanBackgroundColor};
                                            border-radius: 0.375rem;
                                            padding-left: 0.5rem; 
                                            padding-right: 0.5rem;
                                            margin-left: -6px;
                                            margin-right: 12px;
                                            display: flex;
                                            align-items: center;
                                            gap: 0.25rem;
                                            font-size: 16px;
                                            font-weight: 500;
                                            height: 100%;
                                        ">
                                            <img src="data:image/png;base64,${clanBadge!}" />
                                            <p style="margin-bottom: 1.1rem">${escape(data.discord_user.clan!.tag)}</p>
                                        </span>
                                    `}

                                    ${hideBadges ? "" : flags.map(v => `
                                        <img src="data:image/png;base64,${Badges[v]}" style="
                                            width: auto;
                                            height: 20px;
                                            position: relative;
                                            top: 50%;
                                            transform: translate(0%, -50%);
                                            margin-right: 7px;
                                        " />`).join("")
                                    }
                                </div>
                                ${showDisplayName ? 
                                    `<h2 style="
                                        font-size: 0.95rem;
                                        margin: 0;
                                        white-space: nowrap;
                                        font-weight: 400;
                                    ">
                                        ${escape(data.discord_user.username)}
                                    </h2>` 
                                    : ``
                                }
                                ${
                                    userStatus && !hideStatus ? `
                                    <p style="
                                        font-size: 0.9rem;
                                        margin: 0;
                                        color: ${theme === "dark" ? "#aaa" : "#333"};
                                        font-weight: 400;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                    ">
                                    ${
                                        userStatus.emoji?.id ? `
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
                                        " />` : ''
                                    }
                                    ${
                                        userStatus.state && userStatus.emoji?.name && !userStatus.emoji.id 
                                            ? `${userStatus.emoji.name} ${escape(userStatus.state)}` 
                                            : userStatus.state 
                                                ? escape(userStatus.state) 
                                                : !userStatus.state && userStatus.emoji?.name && !userStatus.emoji.id 
                                                    ? escape(userStatus.emoji.name) 
                                                    : ''
                                    }
                                </p>` : ``
                                }
                            </div>
                        </div>`
                    }

                        ${
                            activity ? `
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
                                        activity.assets?.large_image ? `
                                        <img src="data:image/png;base64,${await encodeBase64(
                                        activity.assets.large_image.startsWith("mp:external/")
                                            ? `https://media.discordapp.net/external/${activity.assets.large_image.replace("mp:external/", "")}` 
                                            : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`
                                    )}"
                                        style="
                                            width: 80px;
                                            height: 80px;
                                            border: solid 0.5px #222;
                                            border-radius: 10px;
                                        "/>
                                    ` : `
                                    <img src="data:image/png;base64,${await encodeBase64(
                                        `https://lanyard-profile-readme.vercel.app/assets/unknown.png`
                                    )}" style="
                                        width: 70px;
                                        height: 70px;
                                        margin-top: 4px;
                                        filter: invert(100);
                                    "/>
                                `}
                                ${
                                    activity.assets?.small_image ? `
                                    <img src="data:image/png;base64,${await encodeBase64(
                                        activity.assets.small_image.startsWith("mp:external/")
                                            ? `https://media.discordapp.net/external/${activity.assets.small_image.replace("mp:external/", "")}`
                                            : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`
                                    )}"
                                    style="
                                        width: 30px;
                                        height: 30px;
                                        border-radius: 50%;
                                        margin-left: -26px;
                                        margin-bottom: -8px;
                                    "/>` : ``
                                }
                                </div>
                                <div style="
                                    color: #999;
                                    margin-top: ${
                                        activity.timestamps?.start && !hideTimestamp
                                            ? "-6px"
                                            : "5px"
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
                                                }</p>` : ``
                                        }
                                        ${
                                            activity.timestamps?.start && !hideTimestamp ? `
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
                            ` : ``
                        }

            ${
                data.listening_to_spotify && !activity && !hideSpotify && data.activities[Object.keys(data.activities).length - 1].type === 2
                    ? `
                <div style="
                    display: flex;
                    flex-direction: row;
                    height: 120px;
                    margin-left: 15px;
                    font-size: 0.8rem;
                    padding-top: 18px;
                ">
                    <img src="${await (async () => {
                        const album = await encodeBase64(data.spotify.album_art_url);
                        if (album) return `data:image/png;base64,${album}" style="border: solid 0.5px #222;`;
                        return 'https://lanyard-profile-readme.vercel.app/assets/unknown.png" style="filter: invert(100);';
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
            ` : ``
            }
            ${
                !activity && (!data.listening_to_spotify || hideSpotify) && hideActivity === "false"
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
                </div>` : ``
            }

                    </div>
                </foreignObject>
            </svg>
        `;
};

export default renderCard;
