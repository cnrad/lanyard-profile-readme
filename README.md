<!-- markdownlint-disable -->
# lanyard-profile-readme

🏷️ Utilize Lanyard in your GitHub Profile

_Special thanks to [@Phineas](github.com/Phineas/) for creating Lanyard, and making this project possible_

## Usage

_(Make sure you're in the Lanyard [Discord](discord.gg/wscam7vngf) for this to work!_

In a `README.md` file, include the following, replacing `:id` with your Discord user ID.

```md
[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/:id)](https://discord.com/users/:id)
```

It should display something similar the following (I am using my Discord user ID as an example):

[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/705665813994012695)](https://discord.com/users/705665813994012695)

## Options (wip)

There are a few options to customize this display using query parameters:

### ___Theme___

Append the query param `theme=:theme` to the end of the URL, replacing `:theme` with either `light` or `dark`. This will change the background and the font colors, but the background can be overridden with the ___Background Color___ parameter.

### ___Background Color___

Append the query param `bg=:color` to the end of the URL, replacing `:color` with a hex color of your choice (omit the #)

### ___Toggle Animated Avatar___

If you have an animated avatar, append the query param `animated=:bool` to the end of the URL, replacing `:bool` with `true` or `false`. This is set to `true` by default.
