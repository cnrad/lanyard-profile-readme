import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterLetters(str: string, lettersToRemove: string[] = []) {
  lettersToRemove.forEach((letter) => {
    str = str.replaceAll(letter, "");
  });
  return str;
}

export const getFlags = (flag: number): string[] => {
  const flags: string[] = [];

  // In the order they appear on profiles
  if (flag & 1) flags.push("Discord_Employee"); // 1 << 0
  if (flag & 262144) flags.push("Discord_Certified_Moderator"); // 1 << 18
  if (flag & 2) flags.push("Partnered_Server_Owner"); // 1 << 1
  if (flag & 4) flags.push("HypeSquad_Events"); // 1 << 2
  if (flag & 64) flags.push("House_Bravery"); // 1 << 6
  if (flag & 128) flags.push("House_Brilliance"); // 1 << 7
  if (flag & 256) flags.push("House_Balance"); // 1 << 8
  if (flag & 8) flags.push("Bug_Hunter_Level_1"); // 1 << 3
  if (flag & 16384) flags.push("Bug_Hunter_Level_2"); // 1 << 14
  if (flag & 4194304) flags.push("Active_Developer"); // 1 << 22
  if (flag & 131072) flags.push("Early_Verified_Bot_Developer"); // 1 << 17
  if (flag & 512) flags.push("Early_Supporter"); // 1 << 9

  return flags;
};

export const elapsedTime = (timestamp: number): string => {
  const startTime = timestamp;
  const endTime = Number(new Date());
  let difference = (endTime - startTime) / 1000;

  // we only calculate them, but we don't display them.
  // this fixes a bug in the Discord API that does not send the correct timestamp to presence.
  const daysDifference = Math.floor(difference / 60 / 60 / 24);
  difference -= daysDifference * 60 * 60 * 24;

  const hoursDifference = Math.floor(difference / 60 / 60);
  difference -= hoursDifference * 60 * 60;

  const minutesDifference = Math.floor(difference / 60);
  difference -= minutesDifference * 60;

  const secondsDifference = Math.floor(difference);

  return `${
    hoursDifference >= 1 ? ("0" + hoursDifference).slice(-2) + ":" : ""
  }${("0" + minutesDifference).slice(-2)}:${("0" + secondsDifference).slice(
    -2
  )}`;
};

export const ImageSize = {
  USER_AVATAR: 96,
  USER_DECORATION: 64,
  SERVER_TAG: 32,
  BADGE: 24,
  EMOJI: 32,
  ACTIVITY_LARGE: 128,
  ACTIVITY_SMALL: 32,
};
