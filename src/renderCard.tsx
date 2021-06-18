import * as LanyardTypes from './LanyardTypes';
import { useState } from "react";
import { getFlags } from "./getFlags";

type Parameters = {
    animated?: string;
}

const renderCard = (body: LanyardTypes.Root, params: Parameters): any => {
    //create svg, foreign object almost everything lol

    let avatarBorderColor: string = "#747F8D";
    let userStatus: string = "";
    let avatarExtension: string = "webp";

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

    console.log(flags);

    return `
            <svg width="400px" height="218px">
                <foreignObject>
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: 200px;
                        inset: 0;
                        background-color: #000;
                        color: #fff;
                        font-family: Century Gothic;
                        font-size: 16px;
                        display: flex;
                        flex-direction: column;
                        padding: 5px;
                        border-radius: 10px;
                    ">
                        <div style="
                            position: relative;
                            width: 400px;
                            height: 100px;
                            inset: 0;
                            display: flex;
                            flex-direction: row;
                            border-bottom: solid 0.5px #333;
                        ">
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: auto;
                            ">
                                <img src="https://cdn.discordapp.com/avatars/${body.data.discord_user.id}/${body.data.discord_user.avatar}.${avatarExtension}?size=2048" style="
                                    border: solid 3px ${avatarBorderColor};
                                    border-radius: 50%;
                                    width: 50px;
                                    height: 50px;
                                    position: relative;
                                    top: 10px;
                                    left: 10px;
                                "/>
                            </div>
                            <div style="
                                margin-left: 1.75rem;
                                height: 75px;
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
                        </div>

                        ${body.data.spotify ? 

                            `
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 100px;
                                margin-left: 15px;
                                font-size: 0.75rem;
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
                                    line-height: 0.9rem;
                                    margin-top: -5px;
                                ">
                                    <p style="color: #fff; font-weight: bold;">${body.data.spotify.song}</p>
                                    <p>by <span style="color: #fff">${body.data.spotify.artist}</span></p>
                                    <p style="font-style: italic;">on <span style="color: #e6e6e6">${body.data.spotify.album}</span></p> 
                                </div>
                            </div>
                            `
                        
                        : `
                            <div style="
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
                            </div>
                        `}

                    </div>
                </foreignObject>
            </svg>
        `;
}

export default renderCard;