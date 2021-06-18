import * as LanyardTypes from './LanyardTypes';
import { useState } from "react";
import { getFlags } from "./getFlags";
const renderCard = (body: LanyardTypes.Root): any => {
    //create svg, foreign object almost everything lol

    let avatarBorderColor: string = "#747F8D";
    let userStatus: string = "";

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
            <svg width="100px" height="100px">
                <foreignObject>
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        position: absolute;
                        width: 400px;
                        height: 150px;
                        inset: 0;
                        background-color: #000;
                        color: #fff;
                        font-family: Century Gothic;
                        font-size: 16px;
                        display: flex;
                        flex-direction: row;
                    ">
                        <div style="
                            display: flex;
                            flex-direction: row;
                            height: auto;
                        ">
                            <img src="https://cdn.discordapp.com/avatars/${body.data.discord_user.id}/${body.data.discord_user.avatar}.webp?size=2048" style="
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
                </foreignObject>
            </svg>
        `;
}

export default renderCard;