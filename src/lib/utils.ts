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
