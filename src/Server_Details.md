# Server Global Parameters

<ul>
    <li>
        theme:
        <br/>
        &emsp;- A valid preset theme name from the list provided below. Themes contain preset color patterns to provide color styling attributes for all modals.
    </li>
    <li>
        background:
        <br/>
        &emsp;- The backround parameter can be passed as a valid color name from the list provided below or a valid Hex color string without the first # character. This detemines the color for the background of the modal.
    </li>
    <li>
        border:
        <br/>
        &emsp;- The border parameter can be passed as a valid color name from the list provided below or a valid Hex color string without the first # character. This detemines the color for the border of the modal, if present.
    </li>
    <li>
        stroke:
        <br/>
        &emsp;- The stroke parameter can be passed as a valid color name from the list provided below or a valid Hex color string without the first # character. This detemines the color for the minor details, seperators, or logo background (depending on the modal in question).
    </li>
    <li>
        hideBorder:
        <br/>
        &emsp;- This parameter can be passed as a True or False value. The default for the parameter is a false.
    </li>
    <li>
        borderRadius:
        <br/>
        &emsp;- This parameter can be passed as a valid border radius integer value. The default value for the parameter is 10.
    </li>
</ul>

*** Locale is a parameter not yet utilized inside of this server. It is intended to provide translations to the default phrases on the modals in the future. If you are multilingual and would love to help create translations for the different default modal phrases please reach out to leat me know. Either through my socials or by creating an issue here ***
<br/>
locale: This parameter can be passed as a locale string, with language, script, and regions parts separated by hyphens. The default locale value is en-US. (Ex. zh_Hans_CN for the zh-Hans-CN, en_US for the en-US locale)

## Environmental variables configuration

Example .env configuration:
``` .env
# API Tokens
    GITHUB_TOKEN="<GitHub API Token>"
    WAKATIME_TOKEN="<WakaTime API Token>"


# Redis
    REDIS_USER="<Redis Cloud Username>"
    REDIS_PASS="<Redis cloud password>"
    PROD_HOST="<Redis cloud connection string>"
    PROD_PORT="<Redis cloud port (Redis labs is at: 15872)>"
```
## Register for Statistics Refreshing

Each platform has routes dedicated to registration to refresh User's data on a 8hr interval. There routes follow the following patterns:

Profile Data:
```
    https://greenj-readme-stats.onrender.com/<platform>/register/<username>
```

Profile Streak Data:
*** Streak data is only applicable for LeetCode and GitHub platforms ***
```
    https://greenj-readme-stats.onrender.com/<platform>/streak/register/<username>
```

## Available Pre-set Themes

*** Do note that to be passed as parameters all hyphenated theme names must be repsresented with underscores replacing the hyphens. (Ex. 'greenj-dark' must be 'greenj_dark' ) ***

- default
- greenj-dark
- greenj-light
- dark
- highcontrast
- transparent
- radical
- merko
- gruvbox
- gruvbox-duo
- tokyonight
- tokyonight-duo
- onedark
- onedark-duo
- cobalt
- synthwave
- dracula
- prussian
- monokai
- vue
- vue-dark
- shades-of-purple
- nightowl
- buefy
- buefy-dark
- blue-green
- algolia
- great-gatsby
- darcula
- bear
- solarized-dark
- solarized-light
- chartreuse-dark
- nord
- gotham
- material
- material-palenight
- graywhite
- vision-friendly-dark
- ayu-mirage
- midnight-purple
- calm
- flag-india
- omni
- react
- jolly
- maroongold
- yeblu
- blueberry
- blueberry-duo
- slateorange
- kacho-ga
- ads-juicy-fresh
- black-ice
- soft-green
- blood
- blood-dark
- green-nur
- neon-dark
- neon-palenight
- dark-smoky
- city-lights
- monokai-metallian
- blux
- earth
- deepblue
- holi-theme
- ayu-light
- javascript
- javascript-dark
- noctis-minimus
- github-dark
- github-dark-blue
- github-light
- elegant
- leafy
- navy-gear
- hacker
- garden
- github-green-purple
- icegray
- neon-blurange
- yellowdark
- java-dark
- android-dark
- deuteranopia-friendly-theme
- windows-dark
- git-dark
- python-dark
- sea
- sea-dark
- violet-dark
- horizon
- modern-lilac
- modern-lilac2
- halloween
- violet-punch
- submarine-flowers
- rising-sun
- gruvbox-light
- outrun
- ocean-dark
- discord-old-blurple
- aura-dark
- panda
- cobalt2
- swift
- aura
- apprentice
- moltack
- codestackr
- rose-pine
- date-night
- one-dark-pro
- rose


## Available Colors

The optional parameters for colors on the modals can be presented as either a color name or as any valid Hex code without the # sign.

Named colors available:
- aliceblue 
- antiquewhite 
- aqua 
- aquamarine 
- azure 
- beige 
- bisque 
- black 
- blanchedalmond 
- blue 
- blueviolet 
- brown 
- burlywood 
- cadetblue 
- chartreuse 
- chocolate 
- coral 
- cornflowerblue 
- cornsilk 
- crimson 
- cyan 
- darkblue 
- darkcyan 
- darkgoldenrod 
- darkgray 
- darkgreen 
- darkgrey 
- darkkhaki 
- darkmagenta 
- darkolivegreen 
- darkorange 
- darkorchid 
- darkred 
- darksalmon 
- darkseagreen 
- darkslateblue 
- darkslategray 
- darkslategrey 
- darkturquoise 
- darkviolet 
- deeppink 
- deepskyblue 
- dimgray 
- dimgrey 
- dodgerblue 
- firebrick 
- floralwhite 
- forestgreen 
- fuchsia 
- gainsboro 
- ghostwhite 
- gold 
- goldenrod 
- gray 
- green 
- greenyellow 
- grey 
- honeydew 
- hotpink 
- indianred 
- indigo 
- ivory 
- khaki 
- lavender 
- lavenderblush 
- lawngreen 
- lemonchiffon 
- lightblue 
- lightcoral 
- lightcyan 
- lightgoldenrodyellow 
- lightgray 
- lightgreen 
- lightgrey 
- lightpink 
- lightsalmon 
- lightseagreen 
- lightskyblue 
- lightslategray 
- lightslategrey 
- lightsteelblue 
- lightyellow 
- lime 
- limegreen 
- linen 
- magenta 
- maroon 
- mediumaquamarine 
- mediumblue 
- mediumorchid 
- mediumpurple 
- mediumseagreen 
- mediumslateblue 
- mediumspringgreen 
- mediumturquoise 
- mediumvioletred 
- midnightblue 
- mintcream 
- mistyrose 
- moccasin 
- navajowhite 
- navy 
- oldlace 
- olive 
- olivedrab 
- orange 
- orangered 
- orchid 
- palegoldenrod 
- palegreen 
- paleturquoise 
- palevioletred 
- papayawhip 
- peachpuff 
- peru 
- pink 
- plum 
- powderblue 
- purple 
- rebeccapurple 
- red 
- rosybrown 
- royalblue 
- saddlebrown 
- salmon 
- sandybrown 
- seagreen 
- seashell 
- sienna 
- silver 
- skyblue 
- slateblue 
- slategray 
- slategrey 
- snow 
- springgreen 
- steelblue 
- tan 
- teal 
- thistle 
- tomato 
- transparent 
- turquoise 
- violet 
- wheat 
- white 
- whitesmoke 
- yellow 
- yellowgreen

## Parameter Examples

```
https://greenj-readme-stats.onrender.com/wakatime/stats/<username>?background=springgreen&border=aquamarine&locale=zh_Hans_CN

https://greenj-readme-stats.onrender.com/github/languages/<username>?theme-greenj_dark&hideBorder=true&borderRadius=50
```