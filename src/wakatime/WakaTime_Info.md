<h1 align="center"> Wakatime Development Statistics </h1>
<blockquote align="center">WakaTime is a productivity tracking tool designed specifically for developers, committed to making time tracking fully automatic for every programmer. It integrates with a variety of development tools, such as editors and IDEs, to track the time that developers spend on various coding tasks and provide detailed insights into developers' coding habits. The insights include the languages and frameworks they use most frequently, how much time they spend on specific tasks, and how productive they are overall to helps developers identify areas where they can improve their productivity and get back to what matters most: creating amazing software.</blockquote>
</br>

## Quick implementations
Here are basic Markdown implementations of the WakaTime routes image rendering
```
    [Wakatime Profile Insights](https://greenj-readme-stats.onrender.com/wakatime/insights/<username>)

    [Wakatime Languages Used](https://greenj-readme-stats.onrender.com/wakatime/languages/<username>)

    [Wakatime Stats](https://greenj-readme-stats.onrender.com/wakatime/stats/<username>)
```

## Advanced Image Implimentations:

```
<picture>
    <source 
        srcset="<api route, light themed>"
        media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
    />
    <source
        srcset="<api route, dark themed>"
        media="(prefers-color-scheme: dark)"
    />
    <img 
        src="<base api route>" 
        alt="GreenJ84's WakaTime Profile Stats"
    />
</picture>
```


## Route Details

<br/><br/><br/>

<h3 align="center"> ⚡ WakaTime Development Insights</h3>
<p align="center">
    <picture align="center">
        <source 
            srcset="https://greenj-readme-stats.onrender.com/wakatime/insights/GreenJ84?theme=greenj_light"
            media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
        />
        <source
            srcset="https://greenj-readme-stats.onrender.com/wakatime/insights/GreenJ84?theme=greenj_dark&logo=91FEDD"
            media="(prefers-color-scheme: dark)"
        />
        <img src="https://greenj-readme-stats.onrender.com/wakatime/insights/GreenJ84?theme=greenj_dark&logo=91FEDD" alt="GreenJ84's WakaTime Insights"/>
    </picture>
</p>
</br></br>
<p>
    <a href="//">
        https://greenj-readme-stats.onrender.com/wakatime/insights/&lt;username&gt;
    </a> 
    </br>
    - This route provides an SVG rendering of the user's overall profile insights. This includes, the user's top language and percentage of coding it takes up, average daily coding time, top project developing, and top items for programming category, editor used, and more. 
    </br></br>
    All current parameters for this route are following:
    <ul>
        <li>
            Global API Parameters and descriptions are <a href="../Server_Details.md">here</a>
        </li>
        <li>
            title:
            <br/>
            &emsp;- This optional parameter allows for User's to provide a custom title to the SVG. Please provide the title in Snake_case with your prefered capitilzations. (Ex. GreenJ84's_WakaTime_Insights -> GreenJ84's WakaTime Insights) 
        </li>
        <li>
            textMain:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the main title of the modal. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            logo:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the WakaTime logo. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code. 
        </li>
        <li>
            textSub:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the title of each insight catergory. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            icons:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for all the insight category icons. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            stats:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the value of each insight catergory. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
    </ul> 
</p>

<br/><br/><br/>

<h3 align="center"> ⚡ WakaTime Development Languages</h3>
<p align="center">
    <picture>
        <source 
            srcset="https://greenj-readme-stats.onrender.com/wakatime/languages/GreenJ84?theme=greenj_light"
            media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
        />
        <source
            srcset="https://greenj-readme-stats.onrender.com/wakatime/languages/GreenJ84?theme=greenj_dark"
            media="(prefers-color-scheme: dark)"
        />
        <img src="https://greenj-readme-stats.onrender.com/wakatime/languages/GreenJ84?theme=greenj_dark" alt="GreenJ84's Most Recent questions answered"/>
    </picture>
</p>
</br></br>
<p>
    <a href="//">
        https://greenj-readme-stats.onrender.com/wakatime/languages/&lt;username&gt; 
    </a>
    </br>
    - This route provides a detailed view of the user's top 6 languages used in development on connected platforms with percentages and a pie chart display.
    </br></br>
    All current parameters for this route are following:
    <ul>
        <li>
            Global API Parameters and descriptions are <a href="../Server_Details.md">here</a>
        </li>
        <li>
            title: 
            <br/>
            &emsp;- This optional parameter allows for User's to provide a custom title to the SVG. Please provide the title in Snake_case with your prefered capitilzations. (Ex. GreenJ84's_WakaTime_Development_Languages -> GreenJ84's WakaTime Development Languages)
        </li>
        <li>
            textMain:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the main title of the modal. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        *** All Development language markers and pie section colors are based off of GitHub's language color pairings ***
        <li>
            topStat:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the title of the User's #1 Development language. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            textSub:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the title of each development language after the top language. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            stats:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the percentage statistic of each development language after the top language. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            pieBG:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the background of the pie chart breakdown of the development languages. (Note: This will overwrite the global stroke parameter if provided). Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
    </ul> 
</p>

<br/><br/><br/>

<h3 align="center"> ⚡ WakaTime Development Stats</h3>
<p align="center">
    <picture>
        <source 
            srcset="https://greenj-readme-stats.onrender.com/wakatime/stats/GreenJ84?theme=greenj_light"
            media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
        />
        <source
            srcset="https://greenj-readme-stats.onrender.com/wakatime/stats/GreenJ84?theme=greenj_dark"
            media="(prefers-color-scheme: dark)"
        />
        <img src="https://greenj-readme-stats.onrender.com/wakatime/stats/GreenJ84?theme=greenj_dark" alt="GreenJ84's WakaTime Profile Stats"/>
    </picture>
</p>
</br></br>
<p>
    <a href="//">
        https://greenj-readme-stats.onrender.com/wakatime/stats/&lt;username&gt; 
    </a>
    </br>
    - This route provides a concise detailed view of average daily development time, total days of activity, longest day development stats and total hours of development on the platform.  </br>
    </br></br>
    All current parameters for this route are following:
    <ul>
        <li>Global API Parameters and descriptions are <a href="../Server_Details.md">here</a></li>
        <li>
            title: 
            <br/>
            &emsp;- This optional parameter allows for User's to provide a custom title to the SVG. Please provide the title in Snake_case with your prefered capitilzations. (Ex. GreenJ84's_WakaTime_Development_Stats -> GreenJ84's WakaTime Development Stats)
        </li>
        <li>
            textMain:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the main title of the modal. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            textSub:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the title of each development language after the top language. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            ring:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the ring detail wrapping the main average development time statistic. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            fire:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the fire detail that rests above the main average development time statistic. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            dayAvg:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the title of modal's main statistic title, the average development time. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            sideStat:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the title of the two side statistics, total development time and best development day statisctics. Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
        <li>
            dates:
            <br/>
            &emsp;- This optional parameter allows for the User to provide a color for the sub-title of all the development statistics (the dates and day counts). Please provide the color value as either a <a href="../Server_Details.md">valid </a> color name or HEX code.
        </li>
    </ul> 
</p>
</br></br></br>

## Usage

This API is meant to be a simple development statistics display for User's looking to attatch to personal profiles

