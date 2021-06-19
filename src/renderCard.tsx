import * as LanyardTypes from './LanyardTypes';
import { useState } from "react";
import { getFlags } from "./getFlags";

type Parameters = {
    animated?: string;
}

const renderCard = (body: LanyardTypes.Root, params: Parameters): any => {
    
    let avatarBorderColor: string = "#747F8D";
    let userStatus: string = "";
    let avatarExtension: string = "webp";
    let activity: any = false;

    if(body.data.activities[Object.keys(body.data.activities).length - 1].type === 0) activity = body.data.activities[Object.keys(body.data.activities).length - 1];

    if(body.data.discord_user.avatar.startsWith("a_")) avatarExtension = "gif";
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
            <svg width="400px" height="218px">

                <foreignObject>
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: 200px;
                        inset: 0;
                        background-color: #1a1c1f;
                        color: #fff;
                        font-family: 'Century Gothic';
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
                                <img src="https://cdn.discordapp.com/avatars/${body.data.discord_user.id}/${body.data.discord_user.avatar}.${avatarExtension}?size=2048" style="
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
                                width: 240px;
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
                                                `<img src="/assets/badges/${v}.png" style="
                                                    width: 15px; 
                                                    height: 15px; 
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
                            <a style="
                                position: relative;
                                top: 50%;
                                width: 30px;
                                height: 15px;
                                transform: translate(0, -50%);
                                background-color: #3BA55D;
                                color: #fff;
                                text-align: center;
                                text-decoration: none;
                                border-radius: 5px;
                                font-size: 0.75rem;
                                padding: 5px 10px;
                            " 
                            href="https://discord.com/users/${body.data.discord_user.id}">
                                ADD
                            </a>
                        </div>

                        ${body.data.spotify && !body.data.activities[1] ? 

                            `
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 120px;
                                margin-left: 15px;
                                font-size: 0.75rem;
                                padding-top: 18px;
                            ">
                                <img src="${body.data.spotify.album_art_url}" style="
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
                                    <p style="font-size: 0.7rem; color: #1CB853; margin-bottom: 20px;">LISTENING NOW...</p> 
                                    <p style="color: #fff; font-weight: bold;">${body.data.spotify.song}</p>
                                    <p style="color: #ccc">${body.data.spotify.artist}</p>
                                </div>
                            </div>
                            `
                        
                        : ``}

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
                                ${activity.assets > 0 ? 
                                    `
                                    <img src="https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.webp" style="
                                        width: 80px; 
                                        height: 80px; 
                                        border: solid 0.5px #222;
                                        border-radius: 10px; 
                                    "/>
                                    `
                                : `
                                    <img src="/assets/unknown.png" style="
                                        width: 80px; 
                                        height: 80px; 
                                        filter: invert(100);
                                    "/>
                                `}

                                ${activity.assets ? 
                                    `<img src="https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.webp" style="
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

                        ${!activity && !body.data.listening_to_spotify === false ? 
                            `<div style="
                                display: flex;
                                flex-direction: row;
                                height: 150px;
                                justify-content: center;
                                align-items: center;
                            ">
                                <p style="
                                    font-style: italic; 
                                    font-size: 0.75rem;
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