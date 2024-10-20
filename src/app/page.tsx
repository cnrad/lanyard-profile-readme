"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

import { useSmoothCount } from "use-smooth-count";
import useSWR from "swr";

import { getUserCount } from "@/utils/actions";

export default function Home() {
    const [userId, setUserId] = useState<null | string>(null);
    const [userError, setUserError] = useState<string>();
    const [copyState, setCopyState] = useState("Copy");

    const userCount = useSWR("getUserCount", getUserCount);
    const countRef = useRef<HTMLDivElement | null>(null);
    const counter = useSmoothCount({
        ref: countRef,
        target: userCount.data || 0,
        duration: 3,
        curve: [0, 1, 0, 1],
    });

    const copy = () => {
        navigator.clipboard.writeText(
            `[![Discord Presence](https://lanyard.cnrad.dev/api/${userId})](https://discord.com/users/${userId})`,
        );
        setCopyState("Copied!");

        setTimeout(() => setCopyState("Copy"), 1500);
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
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter your Discord ID"
                    />
                    {userId && (
                        <>
                            <div className="output">
                                [![Discord Presence]({window.location.origin}
                                /api/{userId})](https://discord.com/users/
                                {userId})
                            </div>
                            <button className="action" onClick={copy}>
                                {copyState}
                            </button>
                            <button className="action">Option</button>
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
