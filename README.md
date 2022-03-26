<!-- markdownlint-disable -->
# lanyard-profile-readme

🏷️ Utilize Lanyard to display your Discord Presence in your GitHub Profile

_Special thanks to [@Phineas](https://github.com/Phineas/) for creating Lanyard, and making this project possible_

## Usage

First, join the Lanyard [Discord](https://discord.com/invite/WScAm7vNGF) (if you haven't already) for this to work.

In a `README.md` file, include the following, replacing `:id` with your Discord user ID:

```md
[![Discord Presence](https://lanyard.cnrad.dev/api/:id)](https://discord.com/users/:id)
```

It should display something similar to the following (I am using my Discord user ID as an example):

[![Discord Presence](https://lanyard.cnrad.dev/api/705665813994012695)](https://discord.com/users/705665813994012695)

When others click it, they will be directed to your actual Discord profile. Neat!

## Options

There are a few options to customize this display using query parameters:

### ___Theme___

Append the query param `theme=:theme` to the end of the URL, replacing `:theme` with either `light` or `dark`. This will change the background and the font colors, but the background can be overridden with the ___Background Color___ parameter.

### ___Background Color___

Append the query param `bg=:color` to the end of the URL, replacing `:color` with a hex color of your choice (omit the #)

### ___Border Radius___

Append the query param `borderRadius=:radius` to the end of the URL, replacing `:radius` with a radius of your choice. (default `10px`)

### ___Toggle Animated Avatar___

If you have an animated avatar, append the query param `animated=:bool` to the end of the URL, replacing `:bool` with `true` or `false`. This is set to `true` by default.

### ___Custom Idle Message___

If you don't want the default "`I'm not currently doing anything!`" as your idle message, you can change it by appending `idleMessage=:yourmessage` to the end of the URL. 

### ___Hide Discriminator___

If you don't want people seeing your discriminator (most likely for privacy reasons), append the query param `hideDiscrim=true` to the end of the URL. Your discriminator is shown by default. 

### ___Hide Status___

If you don't want people seeing your status, append the query param `hideStatus=true` to the end of the URL. Your status is shown by default if you have one. 

### ___Hide Elapsed Time___

If you don't want people seeing the elapsed time on an activity, append the query param `hideTimestamp=true` to the end of the URL. Elapsed time is shown by default.

### ___Hide Badges___

If you don't want people seeing the badges you have on Discord, append the query param `hideBadges=true` to the end of the URL. Badges are shown by default.

## ___Example URL and result___

```
[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/94490510688792576?theme=light&bg=809ecf&animated=false&hideDiscrim=true&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...)](https://discord.com/users/94490510688792576)
```

[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/94490510688792576?theme=light&bg=809ecf&animated=false&hideDiscrim=true&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...)](https://discord.com/users/94490510688792576)

\
Note: Current Nitro & Boosting badges **do not work due** to Discord API limitations, unless you currently have an animated avatar, in which case it will display the Nitro badge.

_If you're using this in your profile, feel free to show support and give this repo a ⭐ star! It means a lot, thank you :)_
