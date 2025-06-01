export type ProfileSettings = {
  theme?: string;
  bg?: string;
  clanBackgroundColor?: string;
  animated?: boolean;
  animatedDecoration?: boolean;
  hideDiscrim?: boolean;
  hideStatus?: boolean;
  hideTimestamp?: boolean;
  hideBadges?: boolean;
  hideProfile?: boolean;
  hideActivity?: boolean | "whenNotUsed";
  hideSpotify?: boolean;
  hideTag?: boolean;
  hideDecoration?: boolean;
  ignoreAppId?: string[];
  showDisplayName?: boolean;
  borderRadius?: string;
  idleMessage?: string;
  optimized?: boolean;
};

export type SearchParams = {
  theme?: string;
  bg?: "dark" | "light" | string;
  clanBackgroundColor?: string;
  animated?: string;
  animatedDecoration?: string;
  hideDiscrim?: string;
  hideStatus?: string;
  hideTimestamp?: string;
  hideBadges?: string;
  hideProfile?: string;
  hideActivity?: string;
  hideSpotify?: string;
  hideTag?: string;
  hideDecoration?: string;
  ignoreAppId?: string;
  showDisplayName?: string;
  borderRadius?: string;
  idleMessage?: string;
};

export type IParameterInfo = Array<
  { deprecated?: boolean } & (
    | {
        parameter: string;
        type: "boolean";
        title: string;
        description?: string;
        invertBoolean?: boolean; // set to 'true' to invert the boolean value, e.g. `animated` is FALSE when the 'Disable Animated Avatar" parameter is TRUE
      }
    | {
        parameter: string;
        type: "string";
        title: string;
        description?: string;
        options?: {
          placeholder?: string;
          omit?: string[];
        };
      }
    | {
        parameter: string;
        type: "list";
        title: string;
        description?: string;
        options: {
          list: Array<{
            name: string;
            value: string;
          }>;
        };
      }
  )
>;

export const PARAMETER_INFO: IParameterInfo = [
  {
    parameter: "theme",
    type: "list",
    title: "Theme",
    description:
      "Changes the background and text colors. Can be overridden with the `bg` parameter.",
    options: {
      list: [
        {
          name: "Light",
          value: "light",
        },
        {
          name: "Dark",
          value: "dark",
        },
      ],
    },
  },
  {
    parameter: "bg",
    type: "string",
    title: "Background Color",
    description: "Changes the background color to a hex color (no octothorpe).",
    options: {
      placeholder: "1A1C1F",
      omit: ["#"],
    },
  },
  {
    parameter: "borderRadius",
    type: "string",
    title: "Border Radius",
    description:
      "Changes the border radius of the card. Follows the CSS <length> spec (px, rem, etc.).",
    options: {
      placeholder: "10px",
    },
  },
  {
    parameter: "animated",
    type: "boolean",
    title: "Disable Animated Avatar",
    description: "Disables an animated avatar.",
    invertBoolean: true,
  },
  {
    parameter: "idleMessage",
    type: "string",
    title: "Idle Message",
    description:
      'Changes the idle message. Defaults to "I\'m not currently doing anything!".',
    options: {
      placeholder: "I'm not currently doing anything!",
    },
  },
  {
    parameter: "showDisplayName",
    type: "boolean",
    title: "Show Display Name",
    description: "Shows your global display name alongside your username.",
  },
  {
    parameter: "animatedDecoration",
    type: "boolean",
    title: "Disable Animated Avatar Decoration",
    description: "Disables animated avatar decorations.",
    invertBoolean: true,
  },
  {
    parameter: "hideDecoration",
    type: "boolean",
    title: "Hide Avatar Decoration",
    description: "Hides any avatar decorations.",
  },
  {
    parameter: "hideStatus",
    type: "boolean",
    title: "Hide Status",
    description: "Hides your custom Discord status.",
  },
  {
    parameter: "hideTimestamp",
    type: "boolean",
    title: "Hide Activity Time",
    description: "Hides the time spent on an activity.",
  },
  {
    parameter: "hideTag",
    type: "boolean",
    title: "Hide Server Tag",
    description: "Hides your Server Tag (formerly Guild or Clan Tag)",
  },
  {
    parameter: "hideBadges",
    type: "boolean",
    title: "Hide Badges",
    description: "Hides your profile badges.",
  },
  {
    parameter: "hideProfile",
    type: "boolean",
    title: "Hide Profile",
    description: "Hides your profile, keeps your activity.",
  },
  {
    parameter: "hideActivity",
    type: "boolean",
    title: "Hide Activity",
    description: "Hides your activity, keeps your profile.",
  },
  {
    parameter: "hideSpotify",
    type: "boolean",
    title: "Hide Spotify",
    description: "Hides your Spotify activity only.",
  },
  {
    parameter: "ignoreAppId",
    type: "string",
    title: "Hide App by ID",
    description: "Hide apps by their respective ID, as a comma-separated list.",
    options: {
      placeholder: "1302143410907648071, 1302132259368861759",
    },
  },
  {
    parameter: "hideDiscrim",
    type: "boolean",
    title: "Hide Discriminator",
    description: "Hides your discriminator. (DEPRECATED, RIP)",
    deprecated: true,
  },
].sort((a, b) => b.type.localeCompare(a.type)) as IParameterInfo;
