export const getFlags = (flag: number): string[] => {
    let flags: string[] = [];

    if (flag & 1) flags.push("Discord_Employee");
    if (flag & 2) flags.push("Partnered_Server_Owner");
    if (flag & 4) flags.push("HypeSquad_Events");
    if (flag & 8) flags.push("Bug_Hunter_Level_1");
    if (flag & 64) flags.push("House_Bravery");
    if (flag & 128) flags.push("House_Brilliance");
    if (flag & 256) flags.push("House_Balance");
    if (flag & 512) flags.push("Early_Supporter");
    if (flag & 16384) flags.push("Bug_Hunter_Level_2");
    if (flag & 131072) flags.push("Early_Verified_Bot_Developer");
    if (flag & 262144) flags.push("Discord_Certified_Moderator");

    return flags;
};
