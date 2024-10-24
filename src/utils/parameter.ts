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
];
