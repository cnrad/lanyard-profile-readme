interface DeconstructedSnowflake {
    timestamp: number;
    date: Date;
    workerID: number;
    processID: number;
    increment: number;
    binary: string;
}

const EPOCH = 1420070400000; // Discord's EPOCH

export function isSnowflake(snowflake: string): boolean {
    const { timestamp } = deconstruct(snowflake);
    return timestamp > EPOCH && timestamp <= 3619093655551;
}

const deconstruct = (snowflake: string): DeconstructedSnowflake => {
    const BINARY = idToBinary(snowflake).padStart(64, "0");
    return {
        timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
        get date() {
            return new Date(this.timestamp);
        },
        workerID: parseInt(BINARY.substring(42, 47), 2),
        processID: parseInt(BINARY.substring(47, 52), 2),
        increment: parseInt(BINARY.substring(52, 64), 2),
        binary: BINARY,
    };
};

const idToBinary = (snowflake: string): string => {
    let bin = "";
    let high = parseInt(snowflake.slice(0, -10)) || 0;
    let low = parseInt(snowflake.slice(-10));
    while (low > 0 || high > 0) {
        bin = String(low & 1) + bin;
        low = Math.floor(low / 2);
        if (high > 0) {
            low += 5000000000 * (high % 2);
            high = Math.floor(high / 2);
        }
    }
    return bin;
};
