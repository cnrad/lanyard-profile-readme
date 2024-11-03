"use client";
import React, { useState, useRef, useMemo, JSX } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";

import { useSmoothCount } from "use-smooth-count";
import useSWR from "swr";

import { getUserCount, isUserMonitored } from "@/utils/actions";
import { isSnowflake } from "@/utils/snowflake";
import Link from "next/link";
import { parameterInfo } from "@/utils/parameter";

import * as Icon from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { filterLetters } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home() {
    const originUrl = useMemo(
        () =>
            typeof window !== "undefined"
                ? window.location.origin
                : "https://lanyard.cnrad.dev",
        [],
    );
    const [userId, setUserId] = useState<null | string>(null);
    const [userError, setUserError] = useState<string | JSX.Element>();
    const [userData, setUserData] = useState<{ userId: string } | null>(null);
    const [copyState, setCopyState] = useState("Copy");
    const [outputType, setOutputType] = useState<"markdown" | "html" | "url">(
        "markdown",
    );
    const [isLoading, setIsLoading] = useState(true);
    const [onImageLoaded, setOnImageLoaded] = useState(false);

    const [option, setOption] = useState<
        Array<{ name: string; value: string }>
    >([]);

    const userCount = useSWR("getUserCount", getUserCount);
    const countRef = useRef<HTMLDivElement | null>(null);
    useSmoothCount({
        ref: countRef,
        target: userCount.data || 0,
        duration: 3,
        curve: [0, 1, 0, 1],
    });

    const url = `${originUrl}/api/${userData?.userId}${option.length > 0 ? `?${option.map((o) => `${o.name}=${o.value}`).join("&")}` : ""}`;

    function outputText() {
        if (outputType === "html") {
            return `<a href="https://discord.com/users/${userData?.userId}"><img src="${url}" /></a>`;
        } else if (outputType === "url") {
            return `${url}`;
        } else {
            return `[![Discord Presence](${url})](https://discord.com/users/${userData?.userId})`;
        }
    }

    function copy() {
        navigator.clipboard.writeText(outputText());
        setCopyState("Copied!");

        setTimeout(() => setCopyState("Copy"), 1500);
    }

    async function submitDiscordId() {
        setIsLoading(true);
        setOnImageLoaded(false);
        setUserData(null);
        setUserError(undefined);

        if (!userId) return setUserError("Please enter a Discord ID");

        if (!isSnowflake(userId)) return setUserError("Invalid Discord ID");

        if ((await isUserMonitored(userId)) === false)
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

        setUserData({ userId });
        setIsLoading(false);
    }

    function modifyOption(
        data:
            | {
                  type: "string";
                  name: string;
                  data: string;
                  event: React.ChangeEvent<HTMLInputElement>;
              }
            | {
                  type: "list";
                  name: string;
                  data: string;
              }
            | {
                  type: "boolean";
                  name: string;
                  data: string | boolean;
              },
    ) {
        if (data.type === "string") {
            const filteredValue = encodeURIComponent(
                filterLetters(
                    data.data,
                    (
                        parameterInfo.find(
                            (p) =>
                                p.type === "string" &&
                                p.parameter === data.name,
                        ) as any
                    ).options.omit,
                ),
            );

            setOption((prev) => {
                if (data.data === "") {
                    return prev?.filter((o) => o.name !== data.name) || [];
                } else {
                    if (prev?.find((o) => o.name === data.name)) {
                        return prev.map((o) => {
                            if (o.name === data.name) {
                                o.value = filteredValue;
                            }
                            return o;
                        });
                    } else {
                        return prev
                            ? [
                                  ...prev,
                                  {
                                      name: data.name,
                                      value: filteredValue,
                                  },
                              ]
                            : [
                                  {
                                      name: data.name,
                                      value: filteredValue,
                                  },
                              ];
                    }
                }
            });
        } else if (data.type === "list") {
            setOption((prev) => {
                if (prev?.find((o) => o.name === data.name)) {
                    return prev.map((o) => {
                        if (o.name === data.name) {
                            o.value = data.data;
                        }
                        return o;
                    });
                } else {
                    return prev
                        ? [...prev, { name: data.name, value: data.data }]
                        : [{ name: data.name, value: data.data }];
                }
            });
        } else if (data.type === "boolean") {
            setOption((prev) => {
                if (prev?.find((o) => o.name === data.name)) {
                    return prev
                        .map((opt) => {
                            const options = parameterInfo.find(
                                (p) =>
                                    p.type === "boolean" &&
                                    p.parameter === data.name,
                            )?.options as { defaultBool?: boolean };

                            if (
                                data.data === (options?.defaultBool! || false)
                            ) {
                                return null;
                            } else {
                                if (opt.name === data.name) {
                                    opt.value = data.data.toString();
                                }
                                return opt;
                            }
                        })
                        .filter((opt) => opt !== null);
                } else {
                    return prev
                        ? [
                              ...prev,
                              { name: data.name, value: data.data.toString() },
                          ]
                        : [{ name: data.name, value: data.data.toString() }];
                }
            });
        }
    }

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
                    <form
                        className="flex w-full gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();

                            submitDiscordId();
                        }}
                    >
                        <input
                            className="input"
                            onChange={(e) => setUserId(e.target.value)}
                            value={userId || ""}
                            placeholder="Enter your Discord ID"
                        />
                        <button className="action" type="submit">
                            {">>"}
                        </button>
                    </form>
                    <motion.p
                        variants={{
                            open: { opacity: 1 },
                            closed: { opacity: 0 },
                        }}
                        initial="closed"
                        animate={userError ? "open" : "closed"}
                        className="mt-1 text-sm text-red-500"
                    >
                        * {userError}
                    </motion.p>
                    <motion.div
                        variants={{
                            open: {
                                opacity: 1,
                            },
                            closed: {
                                opacity: 0,
                            },
                        }}
                        initial="closed"
                        animate={!isLoading ? "open" : "closed"}
                        transition={{ duration: 0.5 }}
                    >
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
                            <button
                                className={`action ${outputType === "url" ? "active" : ""}`}
                                onClick={() => setOutputType("url")}
                            >
                                URL
                            </button>
                        </div>
                        <div
                            className="output bg-black"
                            suppressHydrationWarning
                        >
                            {outputText()}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="action" onClick={copy}>
                                {copyState}
                            </button>
                            <Dialog>
                                <DialogTrigger className="action">
                                    Option
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Option</DialogTitle>
                                        <DialogDescription>
                                            Select an option to enable/disable
                                            features to your Lanyard Profile
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="flex max-h-[75dvh] flex-col gap-4 overflow-x-hidden overflow-y-scroll rounded-xl bg-black/50 p-4 px-6 text-[#cecece]">
                                        {parameterInfo.map((item, idx) => {
                                            return (
                                                <div
                                                    key={item.parameter}
                                                    className="flex flex-col gap-1"
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <p>{item.title}</p>
                                                        <TooltipProvider
                                                            delayDuration={100}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    onFocus={(
                                                                        e,
                                                                    ) => {
                                                                        e.preventDefault();
                                                                    }}
                                                                >
                                                                    <Icon.HelpCircleIcon
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    {item.type === "string" && (
                                                        <Input
                                                            placeholder={
                                                                item.options
                                                                    ?.placeholder ||
                                                                "..."
                                                            }
                                                            onChange={(e) =>
                                                                modifyOption({
                                                                    type: "string",
                                                                    name: item.parameter,
                                                                    data: e
                                                                        .target
                                                                        .value,
                                                                    event: e,
                                                                })
                                                            }
                                                            value={decodeURIComponent(
                                                                option?.find(
                                                                    (o) =>
                                                                        o.name ===
                                                                        item.parameter,
                                                                )?.value || "",
                                                            )}
                                                        />
                                                    )}
                                                    {item.type ===
                                                        "boolean" && (
                                                        <Checkbox
                                                            onCheckedChange={(
                                                                bool,
                                                            ) =>
                                                                modifyOption({
                                                                    type: "boolean",
                                                                    name: item.parameter,
                                                                    data: bool,
                                                                })
                                                            }
                                                            checked={
                                                                option?.find(
                                                                    (o) =>
                                                                        o.name ===
                                                                        item.parameter,
                                                                )?.value ===
                                                                "true"
                                                                    ? true
                                                                    : option?.find(
                                                                            (
                                                                                o,
                                                                            ) =>
                                                                                o.name ===
                                                                                item.parameter,
                                                                        )
                                                                            ?.value ===
                                                                        "false"
                                                                      ? false
                                                                      : item
                                                                            .options
                                                                            ?.defaultBool ||
                                                                        false
                                                            }
                                                        />
                                                    )}
                                                    {item.type === "list" && (
                                                        <Select
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                modifyOption({
                                                                    type: "list",
                                                                    name: item.parameter,
                                                                    data: val,
                                                                })
                                                            }
                                                            value={
                                                                option?.find(
                                                                    (o) =>
                                                                        o.name ===
                                                                        item.parameter,
                                                                )?.value || ""
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Theme" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {item.options.list.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            value={
                                                                                option.value
                                                                            }
                                                                            key={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.name
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => setOption([])}>
                                            Reset
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="mt-2">
                            <motion.img
                                className={`${onImageLoaded ? "" : "animate-pulse rounded-md bg-[#3d3d43]"}`}
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: onImageLoaded ? 1 : 0,
                                }}
                                transition={{ duration: 0.5 }}
                                src={url}
                                height={280}
                                width={500}
                                alt="Your Lanyard Banner"
                                onLoad={() => setOnImageLoaded(true)}
                                suppressHydrationWarning
                            />
                        </div>
                    </motion.div>
                </div>
            </main>
            <motion.footer
                variants={{
                    open: {
                        opacity: 1,
                    },
                    closed: {
                        opacity: 0,
                    },
                }}
                animate={isLoading ? "open" : "closed"}
                transition={{ duration: 0.5 }}
                className="stat"
            >
                Lanyard Profile Readme has{" "}
                <div
                    style={{ fontWeight: "bold", width: "3.2rem" }}
                    ref={countRef}
                />{" "}
                total users!
            </motion.footer>
        </>
    );
}
