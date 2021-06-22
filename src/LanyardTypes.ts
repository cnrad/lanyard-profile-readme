//thanks alistair @ uwu.red

export interface Root {
    success: boolean;
    data: Data;
}

export interface Data {
    spotify: Spotify;
    listening_to_spotify: boolean;
    discord_user: DiscordUser;
    discord_status: string;
    activities: Activity[];
    active_on_discord_mobile: boolean;
    active_on_discord_desktop: boolean;
}

export interface Spotify {
    track_id: string;
    timestamps: Timestamps;
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
}

export interface Timestamps {
    start: number;
    end: number;
}

export interface DiscordUser {
    username: string;
    public_flags: number;
    id: string;
    discriminator: string;
    avatar: string;
}

export interface Activity {
    type: number;
    state: string;
    name: string;
    id: string;
    emoji?: Emoji;
    created_at: number;
    application_id?: string;
    timestamps?: Timestamps2;
    sync_id?: string;
    session_id?: string;
    party?: Party;
    flags?: number;
    details?: string;
    assets?: Assets;
    buttons?: string[];
}

export interface Emoji {
    name: string;
    id: number;
    animated: boolean;
}

export interface Timestamps2 {
    start: number;
    end?: number;
}

export interface Party {
    id: string;
}

export interface Assets {
    small_text?: string;
    small_image?: string;
    large_text: string;
    large_image: string;
}
