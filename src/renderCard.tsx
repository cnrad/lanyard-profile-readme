//probably the messiest code i've ever written but it works so :)

import { Badges } from '../public/assets/badges/BadgesEncoded';
import { getFlags } from './getFlags';
import * as LanyardTypes from './LanyardTypes';
import { encodeBase64 } from './toBase64';

type Parameters = {
    theme?: string;
    bg?: string;
    animated?: string;
    hideDiscrim?: string;
    hideStatus?: string;
    borderRadius?: string;
}

const renderCard = async (body: LanyardTypes.Root, params: Parameters): Promise<string> => {
    const defaultAvatar: string = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAY1BMVEVYZfJib/OMlfahqPeWn/eBi/XLz/vq6/7////19f5tePTq7P22vPnV2Pyrsvirsvl3gvT09f7Axfp3gfRtePNsePPg4v22vPq2u/qCi/WhqPjf4/zf4v2Xn/essvjLzvuXnvdbidFTAAAETElEQVR4AezBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAIDZudMtV1UlDuCFRKlWIEJ6uOwbzXn/lzzzYc/GWiT6zya/79WrLeYSc5Vq9IFWa3Sr6JehWt0ZZn5RtFJvmHnodPsrPLx1/B9PKx1ziLOPnIRRO84EXaAP/CWnR3pArTWcybpA5G8NsX20pw+cSbpAngEeOQenY+Cf8KIZ4FuDfSV4Ko/7hS7wNjYH7W3MvNeHtn2jvxn+OXcgaP0x8KJo43vgnwqu85EXDfGVULWON9G1BOmDN/M/AnTgDSWC0xve0KAITeSsykFw4qzOQWB4YwNBOfLmPAHpeXsvr5XOgJkjGA3vIlU6A2bvOHvAnXwiCMrwTl5UpUtg5us7BAB2gcg78nXugaC6QORd+bo7AEAXiLwzX+8SANEFNHPdXcAwV90FDgxA037+zwAc7aZlCKnSNTDrADZBdU6DBwbha5wCAabBkWGkSqfAzFa6C8xeADYB9Y2ByEBsbSMAYAy0zHWPActQLPQuKBh3DiwiDRlwzwFOv9JfTpORh5x5rVfQc8CQiLLJiEMaA1oW6XgVq+grVh4yY56JA68x07fm8hCIhXCUPn823zgkG/HK4Rf6kYv8YBt5BQ03BQyv9CMq8M/JQ7IItw+e6cd8QQjKTqCX3OMTtOdCCNZOoCnqkrYgZEFD2/FF/08qDAE4Dji+TtHPKHknVmBboVB2i9HI9zIGahZUhaVqVxCyQEEVQ7rSBMj3QiPUUTCWJkC+8zrQVjzmELBYG2H5jDYUFqAiQDlMtAwKQgjr+nwoq9O2BSEQJQFVWKeNBSEQ6+BYeG3BFIUAHIfasmsLh7IQgLcjDZd0AWXEIZRDMDYCuuj73g95yJGxEuBLPmr6VBSyzMO9Fpzko3kqeA1r8W4GHOWNKQ/JIl4COL4SZf2lPAQhAY4lYrv860rlIVmHlYAsuBhjFwpCwO4LOkb0TMAzAc8EPBPwTMAGngl4JuCZgMig4jMB27AMykJUhCr4ekwzKI10T9hpwzcz6DNSUbRdORzThW/CJSKagd4LjKurof1suFCYVR54MDckpsBXDLk3pliQgxBTHneBrwiaNtOfeUUKCnMQYlKC32x2r7SlmSUpoOQdi5xtoqx1DNP8WW9kKSCVvAu8QnC2USR4/I2bP5vDmhS80pdOjXULw8dc7HSiL6ljYLTmz/ooKvJTdkqTt9G5s/mHczH6qXlV9I32Ehi0+QVfQbn7HryHhvY033V1Tuu3CRncOIj3rL3EV9pf7+53ced0bY+MIZm7ndEt9uNnkxN8OSWhAvjjZ8ktnIoKaMDHF0yH8S416C4Rpv7bU094pWJ9QFv4BJOBvnkFzjWKMvhu4G78IibMIz2EFM3KFUAwCEI+ID9MDia6kd/+enpFj+YE+af+aA8OZAAAAAAG+Vvf46sAAAAAAAAAAAAAAAAAAAAAAFYCeHSjWah9hFcAAAAASUVORK5CYII=";

    let avatarBorderColor: string = "#747F8D",
        userStatus: string = "",
        avatarExtension: string = "webp",
        statusExtension: string = "webp",
        activity: any = false,
        backgroundColor: string = '1a1c1f',
        theme = 'dark',
        discrim = 'show',
        hideStatus = 'false',
        borderRadius = '10px';

    if (body.data.activities[0]?.emoji?.animated) statusExtension = "gif";
    if (body.data.discord_user.avatar && body.data.discord_user.avatar.startsWith("a_")) avatarExtension = "gif";
    if (body.data.activities.length > 0 && body.data.activities[Object.keys(body.data.activities).length - 1].type === 0) activity = body.data.activities[Object.keys(body.data.activities).length - 1];
    if (params.animated === "false") avatarExtension = "webp";
    if (params.hideStatus === 'true') hideStatus = 'true';
    if (params.hideDiscrim === "true") discrim = "hide";
    if (params.theme === 'light') {
        backgroundColor = '#eee';
        theme = 'light';
    }
    if (params.bg) backgroundColor = params.bg;
    if (params.borderRadius) borderRadius = params.borderRadius;

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

    if (body.data.activities[0] && body.data.activities[0].state && body.data.activities[0].type === 4) userStatus = body.data.activities[0].state;

    console.log(Object.keys(body.data.activities).length);

    return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="410px" height="218px">
                <foreignObject x="0" y="0" width="410" height="218">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: 200px;
                        inset: 0;
                        background-color: #${backgroundColor};
                        color: ${theme === 'dark' ? '#fff' : '#000'};
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
                            border-bottom: solid 0.5px ${theme === 'dark' ? 'hsl(0, 0%, 100%, 10%)' : 'hsl(0, 0%, 0%, 10%)'};
                        ">
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 80px;
                                width: 80px;
                            ">
                                <img ${body.data.discord_user.avatar !== null ?
            `src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/avatars/${body.data.discord_user.id}/${body.data.discord_user.avatar}.${avatarExtension}?size=256`)}"` :
            `src="data:image/png;base64,${defaultAvatar}"`} 
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
                                    ${body.data.discord_user.username}${discrim !== 'hide' ? `<span style="color: ${theme === 'dark' ? '#ccc' : '#666'}; font-weight: lighter;">#${body.data.discord_user.discriminator}</span>` : ''}
                                    </h1>

                                    ${flags.map((v) => `
                                        <img src="data:image/png;base64,${Badges[v]}" style="
                                            width: 20px; 
                                            height: 20px; 
                                            position: relative; 
                                            top: 50%; 
                                            transform: translate(0%, -50%);
                                            margin: 0 0 0 4px;
                                        " />`).join('')}
                                </div>
                                ${userStatus.length > 0 && hideStatus !== "true" ? `
                                    <h1 style="
                                        font-size: 0.9rem;
                                        margin-top: 16px;
                                        color: ${theme === 'dark' ? '#aaa' : '#333'};
                                        font-weight: lighter;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                    ">
                                    ${body.data.activities[0].emoji && body.data.activities[0].emoji.id ? `
                                        <img src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/emojis/${body.data.activities[0].emoji.id}.${statusExtension}`)}" style="
                                            width: 15px; 
                                            height: 15px; 
                                            position: relative; 
                                            top: 10px; 
                                            transform: translate(0%, -50%);
                                            margin: 0 2px 0 0;
                                        " />`: ``}
                                    ${body.data.activities[0].emoji && !body.data.activities[0].emoji.id ? body.data.activities[0].emoji.name + ' ' + userStatus.replace(/\&/g, "and") : userStatus.replace(/\&/g, "and")}
                                </h1>` : ``}
                            </div>
                        </div>

                        ${activity ? `
                            <div style="
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                height: 120px;
                                margin-left: 15px;
                                font-size: 0.75rem;
                                margin-top: 5px;

                            ">
                                <div style="
                                    width: auto;
                                    height: auto;
                                    margin-right: 15px;

                                ">
                                ${activity.assets && activity.assets.large_image ? `
                                    <img src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`)}" style="
                                        width: 80px; 
                                        height: 80px; 
                                        border: solid 0.5px #222;
                                        border-radius: 10px; 
                                    "/>
                                    ` : `
                                    <img src="data:image/png;base64,${await encodeBase64(`https://lanyard-profile-readme.vercel.app/assets/unknown.png`)}" style="
                                        width: 80px; 
                                        height: 80px; 
                                        filter: invert(100);
                                    "/>
                                `}
                                ${activity.assets && activity.assets.small_image ? `
                                    <img src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`)}" style="
                                        width: 30px;
                                        height: 30px;
                                        border-radius: 50%;
                                        margin-left: -26px;
                                        margin-bottom: -8px;
                                    "/>`: ``}
                                </div>
                                <div style="
                                    color: #999;
                                    display: flex;
                                    flex-direction: column;
                                    line-height: 0.1;
                                    width: 279px;
                                ">
                                    <p style="font-size: 0.75rem; color: ${theme === 'dark' ? '#7289DA' : '#334da6'};  font-weight: 600; height: fit-content; white-space: nowrap;">PLAYING A GAME...</p> 
                                    <p style="
                                        color: ${theme === 'dark' ? '#fff' : '#000'}; 
                                        font-weight: bold; 
                                        height: fit-content;
                                        text-overflow: ellipsis;
                                    ">${activity.name}</p>
                                    ${activity.details ? `
                                        <p style="
                                            color: ${theme === 'dark' ? '#ccc' : '#777'};
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                        ">${activity.details}</p>` : ``}
                                </div>
                            </div>
                            `: ``}

            ${body.data.listening_to_spotify === true && body.data.activities[Object.keys(body.data.activities).length - 1].type === 2 ? `
                <div style="
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    height: 120px;
                    margin-left: 15px;
                    font-size: 0.75rem;
                    margin-top: 5px;
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
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        line-height: 0.1;
                        width: 279px;
                    ">
                        <p style="font-size: 0.75rem; font-weight: 600; color: ${theme === 'dark' ? '#1CB853' : '#0d943d'}; ">LISTENING TO SPOTIFY...</p> 
                        <p style="
                            color: ${theme === 'dark' ? '#fff' : '#000'}; 
                            font-weight: bold; 
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        ">${body.data.spotify.song.replace(/\&/g, "and")}</p>
                        <p style="
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            color: ${theme === 'dark' ? '#ccc' : '#777'}; 
                        ">By ${body.data.spotify.artist.replace(/\;/g, ",").replace(/\&/g, "and")}</p>
                    </div>
                </div>
            ` : ``}
            ${!activity && body.data.listening_to_spotify === false ?
            `<div style="
                    display: flex;
                    flex-direction: row;
                    height: 150px;
                    justify-content: center;
                    align-items: center;
                ">
                    <p style="
                        font-style: italic; 
                        font-size: 0.8rem;
                        color: ${theme === 'dark' ? '#aaa' : '#444'};
                        height: auto;
                    ">
                        I'm not currently doing anything!
                    </p>
                </div>`
            : ``}

                    </div>
                </foreignObject>
            </svg>
        `;
}

export default renderCard;
