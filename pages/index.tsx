import Head from "next/head";
import styled from "styled-components";
import { useState } from "react";

export default function Home() {
    const [userId, setUserId] = useState(":id");
    const [copyState, setCopyState] = useState("Copy");
    const copy = () => {
        navigator.clipboard.writeText(`[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/${userId}
                            )](https://discord.com/users/${userId})`);
        setCopyState("Copied!");

        setTimeout(() => setCopyState("Copy"), 1500);
    };

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap"
                    rel="stylesheet"
                />
                <title>Lanyard for GitHub Profile</title>
            </Head>


        </>
    );
}