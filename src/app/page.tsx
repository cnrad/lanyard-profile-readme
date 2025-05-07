"use client";

import React, { useState, JSX } from "react";
import { motion } from "motion/react";
import { isSnowflake } from "@/utils/snowflake";
import { PARAMETER_INFO } from "@/utils/parameters";
import * as Icon from "lucide-react";
import { InfoTooltip } from "@/components/popover";
import { cn, filterLetters } from "@/utils/helpers";

export default function Home() {
  const ORIGIN_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://lanyard.cnrad.dev";

  const [userId, setUserId] = useState("");
  const [userError, setUserError] = useState<string | JSX.Element>();

  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState<Record<string, string | boolean>>({});

  async function onLoadDiscordId(userId: string) {
    setUserId(userId);
    setIsLoaded(false);
    setUserError(undefined);

    if (userId.length < 1) return;
    if (userId.length > 0 && !isSnowflake(userId))
      return setUserError("Invalid Discord ID");
  }

  const url = `${ORIGIN_URL}/api/${userId}${
    Object.keys(options).length > 0
      ? `?${Object.keys(options)
          .map((option) => `${option}=${options[option]}`)
          .join("&")}`
      : ""
  }`;

  return (
    <>
      <main className="flex min-h-screen max-w-[100vw] flex-col items-center max-sm:px-4">
        <div className="relative mt-16 flex w-auto flex-row gap-8">
          <MainSection url={url} userId={userId} className="max-lg:hidden" />

          <div className="w-full sm:max-w-[30rem]">
            <p className="text-left text-3xl font-semibold text-[#cecece] mb-2">
              🏷️ lanyard-profile-readme{" "}
            </p>

            <p className="mb-2 text-sm text-[#aaabaf]">
              Uses{" "}
              <a
                href="https://github.com/Phineas/lanyard"
                target="_blank"
                rel="noreferrer noopener"
                className="text-white underline decoration-transparent underline-offset-2 transition-colors duration-150 ease-out hover:decoration-white"
              >
                Lanyard
              </a>{" "}
              to display your Discord Presence anywhere.
            </p>

            <div className="flex h-[2.25rem] w-full flex-row gap-2">
              <input
                className="w-full rounded-lg border border-white/10 bg-transparent px-2.5 py-1.5 font-mono text-sm text-gray-200 transition-colors duration-150 ease-out focus:border-white/50 focus:outline-none"
                onChange={(e) => onLoadDiscordId(e.target.value)}
                value={userId || ""}
                placeholder="Enter your Discord ID"
              />
            </div>

            {!isLoaded ? (
              <motion.p
                variants={{
                  open: { opacity: 1, display: "block" },
                  closed: { opacity: 0, display: "none" },
                }}
                initial="closed"
                animate={userError ? "open" : "closed"}
                className="mt-1 text-sm text-red-500"
                transition={{ duration: 0.15 }}
              >
                {userError}
              </motion.p>
            ) : null}

            <MainSection
              url={url}
              userId={userId}
              className="block lg:hidden"
            />

            <div
              className={cn(
                "flex flex-col text-white mt-4 p-3 border border-zinc-800 bg-zinc-900/50 rounded-lg mb-4"
              )}
            >
              <div className="grid-rows-auto mb-4 flex w-full flex-col gap-2.5 sm:grid sm:grid-cols-2">
                {PARAMETER_INFO.filter((item) => item.type !== "boolean").map(
                  (item) => {
                    return (
                      <div
                        key={item.parameter}
                        className="flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-300">{item.title}</p>
                          <InfoTooltip
                            content={item.description || "Unknown"}
                          />
                        </div>

                        {item.type === "string" && (
                          <input
                            className="relative h-8 w-full appearance-none rounded-md border border-white/10 bg-transparent px-2 py-0.5 text-sm outline-none transition-all duration-150 ease-out placeholder:text-white/30 focus:border-white/50 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={item.options?.placeholder || "..."}
                            onChange={(e) => {
                              if (e.target.value.length < 1) {
                                const prevOptions = { ...options };
                                delete prevOptions[item.parameter];
                                setOptions(prevOptions);
                              }

                              const filteredValue = encodeURIComponent(
                                filterLetters(
                                  e.target.value,
                                  (
                                    PARAMETER_INFO.find(
                                      (p) => p.parameter === item.parameter
                                    ) as { options: { omit: string[] } }
                                  ).options.omit
                                )
                              );

                              setOptions((prev) => ({
                                ...prev,
                                [item.parameter]: filteredValue,
                              }));
                            }}
                            value={decodeURIComponent(
                              (options[item.parameter] as string) || ""
                            )}
                          />
                        )}

                        {item.type === "list" && (
                          <div className="relative">
                            <select
                              value={(options[item.parameter] as string) || ""}
                              onChange={(e) =>
                                setOptions((prev) => ({
                                  ...prev,
                                  [item.parameter]: e.target.value,
                                }))
                              }
                              className={cn(
                                "relative h-8 w-full appearance-none rounded-md border border-white/10 bg-transparent px-2 py-0.5 text-sm outline-none transition-all duration-150 ease-out placeholder:text-white/30 focus:border-white/50 disabled:cursor-not-allowed disabled:opacity-50",
                                {
                                  "text-white/30":
                                    !options[item.parameter] ||
                                    options[item.parameter] === "",
                                }
                              )}
                            >
                              <option value="" className="bg-background">
                                None
                              </option>
                              {item.options.list.map((option) => (
                                <option
                                  value={option.value}
                                  key={option.value}
                                  className="bg-background"
                                >
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            <Icon.ChevronDown
                              size={14}
                              className="absolute right-2 top-0 my-auto flex h-full text-white/50"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Separated for easier styling/readability */}
              <div className="sm:grid-rows-auto flex flex-col gap-2 sm:grid sm:grid-cols-2">
                {PARAMETER_INFO.filter((item) => item.type === "boolean").map(
                  (item) => {
                    return (
                      <div
                        key={item.parameter}
                        className="flex flex-row items-start gap-2.5 text-sm"
                      >
                        <input
                          type="checkbox"
                          className={cn(
                            "mt-0.5 max-h-4 min-h-4 min-w-4 max-w-4 cursor-pointer appearance-none before:overflow-clip before:rounded-[0.25rem] after:absolute after:h-4 after:w-4 after:rounded-[0.25rem] after:border after:border-white/10 after:transition-all after:duration-150 after:ease-out",
                            {
                              "after:border-gray-200/50 after:bg-gray-500/40":
                                options[item.parameter] === "true",
                              "after:bg-zinc-700/10 after:hover:bg-zinc-700/25":
                                options[item.parameter] !== "true",
                            }
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setOptions((prev) => ({
                                ...prev,
                                [item.parameter]: item.options?.value ?? "true",
                              }));
                            } else {
                              const prevOptions = { ...options };
                              delete prevOptions[item.parameter];
                              setOptions(prevOptions);
                            }
                          }}
                        />

                        <p
                          className="text-gray-300"
                          style={{
                            textDecoration: PARAMETER_INFO.find(
                              (p) => p.parameter === item.parameter
                            )?.deprecated
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {item.title}
                        </p>

                        <InfoTooltip content={item.description || "Unknown"} />
                      </div>
                    );
                  }
                )}
              </div>

              <a
                href="https://github.com/cnrad/lanyard-profile-readme?tab=readme-ov-file#options"
                rel="noreferrer noopener"
                target="_blank"
                className="flex flex-row items-center justify-center gap-2 mt-4 text-sm text-white/75 hover:text-white w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 transition-colors duration-150 ease-out"
              >
                More info
                <Icon.ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const MainSection = ({
  url,
  userId,
  className,
}: {
  url: string;
  userId: string;
  className: string;
}) => {
  const [copyState, setCopyState] = useState("Copy");
  const [outputType, setOutputType] = useState<"markdown" | "html" | "url">(
    "markdown"
  );

  const copyContent = {
    markdown: `[![Discord Presence](${url})](https://discord.com/users/${userId})`,
    html: `<a href="https://discord.com/users/${userId}"><img src="${url}" /></a>`,
    url: `${url}`,
  };

  return (
    <div
      className={cn(
        "mt-2 flex flex-col gap-2 w-full sm:min-w-[30rem] sm:max-w-[30rem]",
        className
      )}
    >
      {userId.length > 0 && isSnowflake(userId) ? (
        <img
          src={url}
          height={280}
          width={500}
          alt="Your Lanyard Banner"
          className="mx-auto"
        />
      ) : (
        <div className="w-full min-h-64 rounded-xl border border-white/10 bg-gray-50/5 flex items-center justify-center text-white/25 font-mono text-sm px-16 text-center">
          Enter your Discord ID to preview your Lanyard Banner
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-1">
        {(["markdown", "html", "url"] as const).map((type) => (
          <button
            key={type}
            className={cn(
              "rounded-md border border-zinc-800 px-1.5 py-1 font-mono text-sm font-medium uppercase tracking-wide text-white/50 transition-colors duration-100 ease-out cursor-pointer",
              {
                "border-white/30 bg-zinc-900 font-semibold text-white/75":
                  outputType === type,
                "hover:border-white/15 hover:bg-zinc-700/25":
                  outputType !== type,
              }
            )}
            onClick={() => setOutputType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="break-all rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 font-mono text-sm text-blue-400 my-2">
        {copyContent[outputType]}
      </div>

      <button
        className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-1 font-mono text-sm font-medium text-white/50 transition-colors duration-75 ease-out hover:bg-zinc-800/75 hover:text-white cursor-pointer"
        onClick={() => {
          navigator.clipboard.writeText(copyContent[outputType]);
          setCopyState("Copied!");
          setTimeout(() => setCopyState("Copy"), 1500);
        }}
      >
        {copyState}
      </button>
    </div>
  );
};
