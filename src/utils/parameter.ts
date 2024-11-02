export type Parameters = {
    theme?: string;
    bg?: string;
    clanbg?: string;
    animated?: string;
    animatedDecoration?: string;
    hideDiscrim?: string;
    hideStatus?: string;
    hideTimestamp?: string;
    hideBadges?: string;
    hideProfile?: string;
    hideActivity?: string;
    hideSpotify?: string;
    hideClan?: string;
    hideDecoration?: string;
    ignoreAppId?: string;
    showDisplayName?: string;
    borderRadius?: string;
    idleMessage?: string;
};

export const ParameterInfo: Array<
    | {
          parameter: string;
          type: "boolean";
          title: string;
          description?: string;
          options?: {
              defaultBool?: boolean;
          };
      }
    | {
          parameter: string;
          type: "string";
          title: string;
          description?: string;
          options?: {
              prefix?: string;
              suffix?: string;
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
> = [
    {
        parameter: "theme",
        type: "list",
        title: "Theme",
        description:
            'This will change the background and the font colors, but the background can be overridden with the "Background Color" parameter.',
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
        description:
            "This will change the background color. Must be in hex format.",
        options: {
            prefix: "#",
        },
    },
    {
        parameter: "borderRadius",
        type: "string",
        title: "Border Radius",
        description: "This will change the border radius of the card.",
        options: {
            suffix: "px",
        },
    },
    {
        parameter: "animated",
        type: "boolean",
        title: "Toggle Animated Avatar",
        description:
            "If you have an animated avatar, but don't want it animated, this is the right option.",
        options: {
            defaultBool: true,
        },
    },
    {
        parameter: "idleMessage",
        type: "string",
        title: "Idle Message",
        description:
            "If you don't want the default \"I'm not currently doing anything!\" as your idle message, this is the right option.",
    },
    {
        parameter: "showDisplayName",
        type: "boolean",
        title: "Show Display Name",
        description:
            "If you don't want to show your display name, this is the right option.",
    },
    {
        parameter: "hideDecoration",
        type: "boolean",
        title: "Hide Avatar Decoration",
        description:
            "If you don't want people seeing your Avatar Decoration, this is the right option.",
    },
    {
        parameter: "animatedDecoration",
        type: "boolean",
        title: "Toggle Animated Avatar Decoration",
        description:
            "If you have an Animated Avatar Decoration, but don't want it animated, this is the right option.",
        options: {
            defaultBool: true,
        },
    },
    {
        parameter: "hideStatus",
        type: "boolean",
        title: "Hide Status",
        description:
            "If you don't want people seeing your status, this is the right option.",
    },
    {
        parameter: "hideTimestamp",
        type: "boolean",
        title: "Hide Elapsed Time",
        description:
            "If you don't want people seeing the elapsed time on an activity, this is the right option.",
    },
    {
        parameter: "hideClan",
        type: "boolean",
        title: "Hide Clan Tag",
        description:
            "If you don't want people seeing your Guild Tag (formerly known as Clans), this is the right option.",
    },
    {
        parameter: "hideBadges",
        type: "boolean",
        title: "Hide Badges",
        description:
            "If you don't want people seeing your Badges, this is the right option.",
    },
    {
        parameter: "hideProfile",
        type: "boolean",
        title: "Hide Profile",
        description:
            "If you don't want people seeing your Profile, this is the right option.",
    },
    {
        parameter: "hideActivity",
        type: "boolean",
        title: "Hide Activity",
        description:
            "If you don't want people seeing your activity, this is the right option.",
    },
    {
        parameter: "hideSpotify",
        type: "boolean",
        title: "Hide Spotify",
        description:
            "If you don't want people seeing your Spotify activity, this is the right option.",
    },
    {
        parameter: "ignoreAppId",
        type: "string",
        title: "Hide App by ID",
        description:
            "If you don't want display a specific application, this is the right option. IDs separate by `,`.",
    },
    {
        parameter: "hideDiscrim",
        type: "boolean",
        title: "Hide Discriminator (DEPRECATED)",
        description:
            "If you don't want people seeing your Discriminator, this is the right option. (DEPRECATED)",
    },
];
