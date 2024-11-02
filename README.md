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

### ___Show Display Name___

If you'd like to show your global display name as well as your username, append the query param `showDisplayName=true` to the end of the URL. This is set to `false` by default.

### ___Avatar Decoration___

#### ___Hide Avatar Decoration___
If you don't want people seeing your Avatar Decoration, append the query param `hideDecoration=true` to the end of the URL. Your Avatar Decoration is shown by default if you have one.

#### ___Toggle Animated Avatar Decoration___
If you have an Animated Avatar Decoration, append the query param `animatedDecoration=:bool` to the end of the URL, replacing `:bool` with `true` or `false`. This is set to `true` by default.

### ___Hide Status___

If you don't want people seeing your status, append the query param `hideStatus=true` to the end of the URL. Your status is shown by default if you have one.

### ___Hide Elapsed Time___

If you don't want people seeing the elapsed time on an activity, append the query param `hideTimestamp=true` to the end of the URL. Elapsed time is shown by default.

### ___Hide Clan Tag___

If you don't want people seeing your Clan Tag (formerly known as Guilds), append the query param `hideClan=true` to the end of the URL. Clan Tag is shown by default.

### ___Hide Badges___

If you don't want people seeing the badges you have on Discord, append the query param `hideBadges=true` to the end of the URL. Badges are shown by default.

### ___Hide Profile___

If you don't want people seeing the profile you have on Discord, append the query param `hideProfile=true` to the end of the URL. Profile are shown by default.

### ___Hide Activity___

If you don't want people seeing the your activity, append the query param `hideActivity=true` to the end of the URL or use `hideActivity=whenNotUsed` to hide activity section when there's no activity to display. Activity are shown by default.

### ___Hide Spotify___

If you don't want people seeing your Spotify activity, append the query param `hideSpotify=true` to the end of the URL. Spotify activity is shown by default.

### ___Hide App by ID___

If you don't want to display a specific application, append the query param `ignoreAppId=:app_id` to the end of the URL, IDs separate by `,`.

### ___Hide Discriminator___ (DEPRECATED soon)

If you don't want people seeing your discriminator (most likely for privacy reasons), append the query param `hideDiscrim=true` to the end of the URL. Your discriminator is shown by default.

## ___Example URL and result___

```
[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/94490510688792576?theme=light&bg=809ecf&animated=false&hideDiscrim=true&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...)](https://discord.com/users/94490510688792576)
```

[![Discord Presence](https://lanyard-profile-readme.vercel.app/api/94490510688792576?theme=light&bg=809ecf&animated=false&hideDiscrim=true&borderRadius=30px&idleMessage=Probably%20doing%20something%20else...)](https://discord.com/users/94490510688792576)

\
Note: Current Nitro & Boosting badges **do not work due** to Discord API limitations, unless you currently have an animated avatar, in which case it will display the Nitro badge.

_If you're using this in your profile, feel free to show support and give this repo a ⭐ star! It means a lot, thank you :)_
