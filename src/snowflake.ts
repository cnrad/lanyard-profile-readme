const EPOCH = 1420070400000; // Discord's EPOCH

// Snowflakes will never be a string
export function isSnowflake(snowflake: number | string): boolean {
    snowflake = Number(snowflake);
    return (
        Number.isInteger(+snowflake) && snowflake > 4194304 && !isNaN(new Date(snowflake / 4194304 + EPOCH).getTime())
    );
}
