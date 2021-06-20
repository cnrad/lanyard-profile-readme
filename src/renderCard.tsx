import * as LanyardTypes from './LanyardTypes';
import { useState } from "react";
import { getFlags } from "./getFlags";
import encodeBase64 from './toBase64';
import { encode } from 'querystring';
import { Badges } from '../public/assets/badges/BadgesEncoded'

const imageToBase64 = require('image-to-base64');

type Parameters = {
    animated?: string;
}

const renderCard = async (body: LanyardTypes.Root, params: Parameters): Promise<any> => {
    
    let avatarBorderColor: string = "#747F8D";
    let userStatus: string = "";
    let avatarExtension: string = "webp";
    let activity: any = false;

    if(body.data.activities.length > 0) {
        if(body.data.activities[Object.keys(body.data.activities).length - 1].type === 0) activity = body.data.activities[Object.keys(body.data.activities).length - 1];
    }
    
    let defaultAvatar: string = "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAY1BMVEVYZfJib/OMlfahqPeWn/eBi/XLz/vq6/7////19f5tePTq7P22vPnV2Pyrsvirsvl3gvT09f7Axfp3gfRtePNsePPg4v22vPq2u/qCi/WhqPjf4/zf4v2Xn/essvjLzvuXnvdbidFTAAAETElEQVR4AezBgQAAAACAoP2pF6kCAAAAAAAAAAAAAAAAAAAAAIDZudMtV1UlDuCFRKlWIEJ6uOwbzXn/lzzzYc/GWiT6zya/79WrLeYSc5Vq9IFWa3Sr6JehWt0ZZn5RtFJvmHnodPsrPLx1/B9PKx1ziLOPnIRRO84EXaAP/CWnR3pArTWcybpA5G8NsX20pw+cSbpAngEeOQenY+Cf8KIZ4FuDfSV4Ko/7hS7wNjYH7W3MvNeHtn2jvxn+OXcgaP0x8KJo43vgnwqu85EXDfGVULWON9G1BOmDN/M/AnTgDSWC0xve0KAITeSsykFw4qzOQWB4YwNBOfLmPAHpeXsvr5XOgJkjGA3vIlU6A2bvOHvAnXwiCMrwTl5UpUtg5us7BAB2gcg78nXugaC6QORd+bo7AEAXiLwzX+8SANEFNHPdXcAwV90FDgxA037+zwAc7aZlCKnSNTDrADZBdU6DBwbha5wCAabBkWGkSqfAzFa6C8xeADYB9Y2ByEBsbSMAYAy0zHWPActQLPQuKBh3DiwiDRlwzwFOv9JfTpORh5x5rVfQc8CQiLLJiEMaA1oW6XgVq+grVh4yY56JA68x07fm8hCIhXCUPn823zgkG/HK4Rf6kYv8YBt5BQ03BQyv9CMq8M/JQ7IItw+e6cd8QQjKTqCX3OMTtOdCCNZOoCnqkrYgZEFD2/FF/08qDAE4Dji+TtHPKHknVmBboVB2i9HI9zIGahZUhaVqVxCyQEEVQ7rSBMj3QiPUUTCWJkC+8zrQVjzmELBYG2H5jDYUFqAiQDlMtAwKQgjr+nwoq9O2BSEQJQFVWKeNBSEQ6+BYeG3BFIUAHIfasmsLh7IQgLcjDZd0AWXEIZRDMDYCuuj73g95yJGxEuBLPmr6VBSyzMO9Fpzko3kqeA1r8W4GHOWNKQ/JIl4COL4SZf2lPAQhAY4lYrv860rlIVmHlYAsuBhjFwpCwO4LOkb0TMAzAc8EPBPwTMAGngl4JuCZgMig4jMB27AMykJUhCr4ekwzKI10T9hpwzcz6DNSUbRdORzThW/CJSKagd4LjKurof1suFCYVR54MDckpsBXDLk3pliQgxBTHneBrwiaNtOfeUUKCnMQYlKC32x2r7SlmSUpoOQdi5xtoqx1DNP8WW9kKSCVvAu8QnC2USR4/I2bP5vDmhS80pdOjXULw8dc7HSiL6ljYLTmz/ooKvJTdkqTt9G5s/mHczH6qXlV9I32Ehi0+QVfQbn7HryHhvY033V1Tuu3CRncOIj3rL3EV9pf7+53ced0bY+MIZm7ndEt9uNnkxN8OSWhAvjjZ8ktnIoKaMDHF0yH8S416C4Rpv7bU094pWJ9QFv4BJOBvnkFzjWKMvhu4G78IibMIz2EFM3KFUAwCEI+ID9MDia6kd/+enpFj+YE+af+aA8OZAAAAAAG+Vvf46sAAAAAAAAAAAAAAAAAAAAAAFYCeHSjWah9hFcAAAAASUVORK5CYII=";

    if(body.data.discord_user.avatar !== null && body.data.discord_user.avatar.startsWith("a_")) avatarExtension = "gif";
    if(params.animated === "false") avatarExtension = "webp";

    switch(body.data.discord_status){
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

    let flags: string[] = getFlags(body.data.discord_user.public_flags);

    if(body.data.activities[0] && body.data.activities[0].type === 4) userStatus = body.data.activities[0].state;

    console.log(Object.keys(body.data.activities).length);

    return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="410px" height="218px">
                <foreignObject x="0" y="0" width="410" height="218">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: 200px;
                        inset: 0;
                        background-color: #1a1c1f;
                        color: #fff;
                        font-family: 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        font-size: 16px;
                        display: flex;
                        flex-direction: column;
                        padding: 5px;
                        border-radius: 10px;
                    ">
                        <div style="
                            width: 400px;
                            height: 100px;
                            inset: 0;
                            display: flex;
                            flex-direction: row;
                            padding-bottom: 5px;
                            border-bottom: solid 0.5px #333;
                        ">
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 80px;
                                width: 80px;
                            ">
                                <img ${body.data.discord_user.avatar !== null ?
                                    `src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/avatars/${body.data.discord_user.id}/${body.data.discord_user.avatar}.${avatarExtension}?size=512`)}"` :
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
                                    top: ${userStatus.length > 0 ? "35%" : "50%"};
                                    transform: translate(0, -50%);
                                    height: 25px;
                                ">

                                    <h1 style="
                                        font-size: 1.15rem;
                                        margin: 0 5px 0 0;
                                    ">
                                        ${body.data.discord_user.username}<span style="color: #aaa; font-weight: lighter;">#${body.data.discord_user.discriminator}</span>
                                    </h1>

                                    ${
                                        flags.map((v) => {
                                            return(
                                                `<img src="data:image/png;base64,${Badges[v]}" style="
                                                    width: 20px; 
                                                    height: 20px; 
                                                    position: relative; 
                                                    top: 50%; 
                                                    transform: translate(0%, -50%);
                                                    margin: 0 0 0 4px;
                                                " />`
                                            )
                                        }).join('')
                                    }

                                </div>
                            
                                <h1 style="
                                    font-size: 0.9rem;
                                    margin-top: 15px;
                                    color: #888;
                                    font-weight: lighter;
                                    display: ${userStatus.length > 0 ? "inherit" : "none"}
                                ">
                                    ${userStatus}
                                </h1>

                            </div>
                        </div>

                        ${activity ? 
                            
                            `
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
                                ${activity.assets.large_image ? 
                                    `
                                    <img src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp`)}" style="
                                        width: 80px; 
                                        height: 80px; 
                                        border: solid 0.5px #222;
                                        border-radius: 10px; 
                                    "/>
                                    `
                                : `
                                    <img src="data:image/png;base64,${await encodeBase64(`https://lanyard-profile-readme.vercel.app/assets/unknown.png`)}" style="
                                        width: 80px; 
                                        height: 80px; 
                                        filter: invert(100);
                                    "/>
                                `}

                                ${activity.assets.small_image ? 
                                    `<img src="data:image/png;base64,${await encodeBase64(`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp`)}" style="
                                        width: 30px;
                                        height: 30px;
                                        border-radius: 50%;
                                        margin-left: -26px;
                                        margin-bottom: -8px;
                                    "/>`
                                : ``}

                                </div>
                                <div style="
                                    color: #999;
                                    line-height: 0.5rem;
                                ">
                                    <p style="font-size: 0.7rem; color: #7289DA; margin-bottom: 20px;">PLAYING A GAME...</p> 
                                    <p style="color: #fff; font-weight: bold;">${activity.name}</p>
                                    ${activity.details ? 
                                        `<p style="color: #ccc">${activity.details}</p>`
                                    : ``}
                                   
                                </div>
                            </div>
                            `
                        
                        : ``}

                        ${body.data.listening_to_spotify === true && body.data.activities[Object.keys(body.data.activities).length - 1].type === 2 ? 

                            `
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
                                    line-height: 0.5rem;
                                ">
                                    <p style="font-size: 0.75rem; color: #1CB853; margin-bottom: 20px;">LISTENING NOW...</p> 
                                    <p style="color: #fff; font-weight: bold;">${body.data.spotify.song}</p>
                                    <p style="color: #ccc">${body.data.spotify.artist}</p>
                                </div>
                            </div>
                            `
                        
                        : ``}

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
                                    color: #777;
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