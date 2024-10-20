"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

import { useSmoothCount } from "use-smooth-count";
import useSWR from "swr";

import { getUserCount, isUserMonitored } from "@/utils/actions";
import { isSnowflake } from "@/utils/snowflake";
import Link from "next/link";

export default function Home() {
    const [userId, setUserId] = useState<null | string>(null);
    const [userError, setUserError] = useState<string | JSX.Element>();
    const [copyState, setCopyState] = useState("Copy");
    const [outputType, setOutputType] = useState<"markdown" | "html">(
        "markdown",
    );

    const userCount = useSWR("getUserCount", getUserCount);
    const countRef = useRef<HTMLDivElement | null>(null);
    const counter = useSmoothCount({
        ref: countRef,
        target: userCount.data || 0,
        duration: 3,
        curve: [0, 1, 0, 1],
    });

    const outputText = () => {
        if (outputType === "html") {
            return `<a href="https://discord.com/users/${userId}"><img src="https://lanyard-profile-readme.vercel.app/api/${userId}" /></a>`;
        } else {
            return `[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/${userId})](https://discord.com/users/${userId})`;
        }
    };
    const copy = () => {
        navigator.clipboard.writeText(outputText());
        setCopyState("Copied!");

        setTimeout(() => setCopyState("Copy"), 1500);
    };

    const changeDiscordId = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setUserError(undefined);
        setUserId(e.target.value);
        if (e.target.value === "") return;

        if (!isSnowflake(e.target.value))
            return setUserError("Invalid Discord ID");

        if ((await isUserMonitored(e.target.value)) === false)
            return setUserError(
                <>
                    User is not being monitored by Lanyard, please join{" "}
                    <Link
                        href="https://discord.gg/lanyard"
                        target="_blank"
                        className="underline"
                    >
                        this server
                    </Link>{" "}
                    and try again.
                </>,
            );
    };

    return (
        <>
            <main className="flex min-h-screen max-w-[100vw] flex-col items-center">
                <div className="mt-16 w-[80%] max-w-[28rem] rounded-md">
                    <p className="my-2 text-left text-3xl font-semibold text-[#cecece]">
                        lanyard profile readme 🏷️
                    </p>
                    <p className="text-base text-[#aaabaf]">
                        Utilize Lanyard to display your Discord Presence in your
                        GitHub Profile
                    </p>
                    <br />
                    <input
                        className="input"
                        onChange={changeDiscordId}
                        placeholder="Enter your Discord ID"
                    />
                    {userError && (
                        <p className="mt-1 text-sm text-red-500">
                            * {userError}
                        </p>
                    )}
                    {userId && (
                        <>
                            <div className="mb-1 mt-4 flex gap-1">
                                <button
                                    className={`action ${outputType === "markdown" ? "active" : ""}`}
                                    onClick={() => setOutputType("markdown")}
                                >
                                    Markdown
                                </button>
                                <button
                                    className={`action ${outputType === "html" ? "active" : ""}`}
                                    onClick={() => setOutputType("html")}
                                >
                                    HTML
                                </button>
                            </div>
                            <div className="output bg-black">
                                {outputText()}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button className="action" onClick={copy}>
                                    {copyState}
                                </button>
                                <button className="action">Option</button>
                            </div>
                            {!userError && (
                                <div className="mt-2">
                                    <img
                                        src={`/api/${userId}`}
                                        height={350}
                                        width={500}
                                        alt="Your Lanyard banner"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <footer className="stat">
                Lanyard Profile Readme has{" "}
                <div
                    style={{ fontWeight: "bold", width: "3.2rem" }}
                    ref={countRef}
                />{" "}
                total users!
            </footer>
        </>
    );
}
