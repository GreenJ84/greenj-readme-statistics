<h1 align="center">🚀 GreenJ ReadMe Statistics API</h1>
<p align="center">
Generate dynamic GitHub, LeetCode, and WakaTime statistic cards for your GitHub profile, portfolio, or personal website.
</p>
<p align="center">
Built with TypeScript, Express, Redis caching, SVG rendering, and automated refresh pipelines.
</p>
<p align="center">
  <a href="https://greenj-readme-stats.onrender.com">
    <img alt="Live API" src="https://img.shields.io/badge/Live-API-2ea44f?style=for-the-badge" />
  </a>

  <a href="https://github.com/GreenJ84/github-readme-stats-typescript">
    <img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" />
  </a>
</p>

<h2>✨ What Is GreenJ ReadMe Statistics?</h2>
<p>
  GreenJ ReadMe Statistics is a public API designed to generate live developer statistic cards as SVG images.
</p>
<p>
  The API aggregates development activity from platforms like GitHub, LeetCode, and WakaTime, then transforms that data into embeddable visual cards that can be dropped directly into:
</p>
<ul>
  <li>GitHub profile READMEs</li>
  <li>Portfolio websites</li>
  <li>Developer dashboards</li>
  <li>Personal landing pages</li>
  <li>Technical blogs</li>
</ul>
<p>
  The system focuses on performance, caching efficiency, clean rendering, and developer-friendly integration.
</p>

<h2>⚡ Features</h2>
<ul>
  <li>Dynamic SVG statistic generation</li>
  <li>GitHub, LeetCode, and WakaTime integrations</li>
  <li>Redis-backed caching for low-latency responses</li>
  <li>Background refresh pipelines for stale data reduction</li>
  <li>Theme-aware embeds for dark/light GitHub profiles</li>
  <li>REST and GraphQL upstream integrations</li>
  <li>Production-ready Docker deployment support</li>
  <li>Public API with simple URL-based integration</li>
</ul>

<h2>🧩 Route Structure</h2>

<pre>
  /:platform/:route/:username
</pre>
<ul>
  <li><strong>platform</strong>: The platform to query (e.g., github, leetcode, wakatime)</li>
  <li><strong>route</strong>: The specific route for the platform (e.g., stats, streak, languages)</li>
  <li><strong>username</strong>: The user's identifier on the platform</li>
</ul>
<p>
Example:
</p>
<pre>
https://greenj-readme-stats.onrender.com/github/stats/GreenJ84
</pre>

<h2>🔥 Getting Started</h2>

<h3>⚡️ Quick Embed</h3>

```md
![GitHub Stats](https://greenj-readme-stats.onrender.com/github/stats/GreenJ84)

<img
  src="https://greenj-readme-stats.onrender.com/github/stats/GreenJ84"
  alt="GitHub Stats Example"
/>
```

<p align="center">
  <img
    src="https://greenj-readme-stats.onrender.com/github/stats/GreenJ84"
    alt="GitHub Stats Example"
  />
</p>

<h3>🌗 Theme-Aware Embeds</h3>
<p>
Supports automatic dark/light mode switching using the HTML <code>&lt;picture&gt;</code> element.
</p>

```md
<picture>
    <source
        srcset="https://greenj-readme-stats.onrender.com/github/stats/GreenJ84?theme=light"
        media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
    />

    <source
        srcset="https://greenj-readme-stats.onrender.com/github/stats/GreenJ84?theme=dark"
        media="(prefers-color-scheme: dark)"
    />

    <img
        src="https://greenj-readme-stats.onrender.com/github/stats/GreenJ84"
        alt="GitHub Statistics"
    />
</picture>
```

<h2>📦 Supported Platforms</h2>
<table>
  <tr>
    <th>Platform</th>
    <th>Description</th>
  </tr>

  <tr>
    <td><strong>GitHub</strong></td>
    <td>Repository, contribution, and language statistics</td>
  </tr>

  <tr>
    <td><strong>LeetCode</strong></td>
    <td>Problem-solving and submission statistics</td>
  </tr>

  <tr>
    <td><strong>WakaTime</strong></td>
    <td>Development activity and coding productivity metrics</td>
  </tr>
</table>


<h3>📊 GitHub Routes</h3>
<table>
  <tr>
    <th>Route</th>
    <th>Description</th>
  </tr>

  <tr>
    <td><code>/github/stats/:username</code></td>
    <td>General GitHub profile statistics</td>
  </tr>

  <tr>
    <td><code>/github/streak/:username</code></td>
    <td>Contribution streak statistics</td>
  </tr>

  <tr>
    <td><code>/github/languages/:username</code></td>
    <td>Top language usage breakdown</td>
  </tr>

  <tr>
    <td><code>/github/activity/:username</code></td>
    <td>Contribution activity visualization</td>
  </tr>

  <tr>
    <td><code>/github/register/:username</code></td>
    <td>Register user for GitHub data background refreshing</td>
  </tr>

  <tr>
    <td><code>/github/register/streak/:username</code></td>
    <td>Register user for GitHub streak data background refreshing</td>
  </tr>
</table>
<p>
Example:
</p>

```md
  ![GreenJ's GitHub Stats](https://greenj-readme-stats.onrender.com/github/stats/GreenJ84)

  <img
    src="https://greenj-readme-stats.onrender.com/github/stats/GreenJ84"
    alt="GreenJ's GitHub Stats"
  />
```

<p>For more details about GitHub routes view the platform specific documentation <a href="./src/github/Github_Info.md">here</a>.</p>

<h3>🧠 LeetCode Routes</h3>
<table>
  <tr>
    <th>Route</th>
    <th>Description</th>
  </tr>

  <tr>
    <td><code>/leetcode/stats/:username</code></td>
    <td>General LeetCode statistics</td>
  </tr>

  <tr>
    <td><code>/leetcode/streak/:username</code></td>
    <td>Problem-solving streak metrics</td>
  </tr>

  <tr>
    <td><code>/leetcode/completion/:username</code></td>
    <td>Question completion metrics</td>
  </tr>

  <tr>
    <td><code>/leetcode/submission/:username</code></td>
    <td>Recent submission activity</td>
  </tr>

  <tr>
    <td><code>/leetcode/register/:username</code></td>
    <td>Register user for LeetCode data background refreshing</td>
  </tr>

  <tr>
    <td><code>/leetcode/register/streak/:username</code></td>
    <td>Register user for LeetCode streak data background refreshing</td>
  </tr>
</table>
<p>
Example:
</p>

```md
  ![GreenJ's LeetCode Streak](https://greenj-readme-stats.onrender.com/leetcode/streak/GreenJ84)

  <img
    src="https://greenj-readme-stats.onrender.com/leetcode/streak/GreenJ84"
    alt="GreenJ's LeetCode Streak"
  />
```

<p>For more details about LeetCode routes view the platform specific documentation <a href="./src/leetcode/Leetcode_Info.md">here</a>.</p>

<h3>⏱️ WakaTime Routes</h3>
<table>
  <tr>
    <th>Route</th>
    <th>Description</th>
  </tr>

  <tr>
    <td><code>/wakatime/stats/:username</code></td>
    <td>Overall coding activity statistics</td>
  </tr>

  <tr>
    <td><code>/wakatime/languages/:username</code></td>
    <td>Language usage metrics</td>
  </tr>

  <tr>
    <td><code>/wakatime/insights/:username</code></td>
    <td>Developer productivity insights</td>
  </tr>

  <tr>
    <td><code>/wakatime/register/:username</code></td>
    <td>Register user for WakaTime data background refreshing</td>
  </tr>
</table>
<p>
Example:
</p>

```md
  ![GreenJ's WakaTime Insights](https://greenj-readme-stats.onrender.com/wakatime/insights/GreenJ84)

  <img
    src="https://greenj-readme-stats.onrender.com/wakatime/insights/GreenJ84"
    alt="GreenJ's WakaTime Insights"
  />
```

<p>For more details about WakaTime routes view the platform specific documentation <a href="./src/wakatime/WakaTime_Info.md">here</a>.</p>

<h2>🎨 Customization</h2>
<p>
Cards support customizable themes and rendering options through query parameters. A few of the parameters are below:
</p>
<table>
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>

  <tr>
    <td><code>theme</code></td>
    <td>Select rendering theme</td>
  </tr>

  <tr>
    <td><code>background</code></td>
    <td>Customize card background color</td>
  </tr>

  <tr>
    <td><code>border</code></td>
    <td>Customize card border color</td>
  </tr>

  <tr>
    <td><code>hideBorder</code></td>
    <td>Toggle card borders</td>
  </tr>

  <tr>
    <td><code>borderRadius</code></td>
    <td>Toggle card borders</td>
  </tr>

  <tr>
    <td><code>stroke</code></td>
    <td>Customize card stroke color</td>
  </tr>
</table>
<p>
Example:
</p>

```md
https://greenj-readme-stats.onrender.com/github/stats/GreenJ84?theme=dark
```

<p>For more information on customization options, refer to the <a href="./src/Customization.md">Customization Documentation</a>.</p>

<h2>Getting Started</h2>

<h3>Steps:</h3>
<ol>
  <li>Clone the repository</li>
  <li>Navigate to the project directory</li>
  <li>Install dependencies</li>
  <li>Configure the application's environment variables from template file</li>
</ol>

```bash
git clone https://github.com/GreenJ84/github-readme-stats-typescript.git # 1

cd github-readme-stats-typescript # 2

npm install # 3

mv .env.template .env # 4 - Fill in based on template instructions
```

<h3>▶️ Local Development</h3>

<h3>Requirements</h3>
<ul>
  <li>Node.js</li>
  <li>Redis instance (local or cloud)</li>
</ul>

<h3>Steps:</h3>
<ol>
  <li>Start the Redis instance (if using a local Redis server)</li>
  <li>Run the development server</li>
</ol>

```bash
brew services start redis # 1 - If using local redis on macOS
sudo systemctl start redis-server # 1 - If using local redis on Linux
sudo service redis-server start # 1 - If using local redis on Windows
redis-server # 1 - If using local redis with direct invocation (Linux/MacOS)

npm run dev # 2
```

<p>
  The API server will start on:
</p>

```text
http://localhost:8000
```

<h3>🐳 Docker Deployment</h3>

<h3>Requirements:</h3>
<ul>
  <li>Docker Engine</li>
</ul>

<h3>Steps:</h3>
<ol>
  <li>Build the Docker image</li>
  <li>Run the Docker container</li>
</ol>

<h3>Build Container</h3>

```bash
brew services start redis # 1 - If using local redis on macOS
sudo systemctl start redis-server # 1 - If using local redis on Linux
sudo service redis-server start # 1 - If using local redis on Windows
redis-server # 1 - If using local redis with direct invocation (Linux/MacOS)

docker build -t greenj-readme-stats . # 2

docker run -p 8000:8000 -d greenj-readme-stats # 3
```

<h2>🪪 License</h2>
<p>
  This project is licensed under the MIT License - see the <a href="/License.md">LICENSE.md</a> file for details.
</p>
<p>
  The MIT License is a permissive license that allows users to use, copy, modify, merge, publish, distribute, and sublicense the software, provided that they include the original copyright notice and disclaimer. It also provides an implied warranty of fitness for a particular purpose and limits the liability of the software's authors and contributors.
</p>
<p>
  By using or contributing to this project, you agree to be bound by the terms and conditions of the MIT License.
</p>
<p>
  If you have any questions about the license or would like to use this software under a different license, please contact the project maintainers.
</p>

<h2>🤗 Contributing</h2>
<p>Contributions are welcome!</p>
<p>
  Please refer to my profile <a href="https://github.com/GreenJ84/GreenJ84/blob/main/profile_code_of_conduct.md#contributor-code-of-conduct">Code of Conduct</a> before contributing to this project.
</p>
<p>
  My <a href="https://github.com/GreenJ84/GreenJ84/blob/main/profile_contributions.md.md#profile-contributions-guidline">Contribution Guide</a> has more details on how to get started contributing.
</p>
<p>
  Feel free to open an <a href="https://github.com/GreenJ84/greenj-readme-statistics/issues/new/choose">issue</a> or submit a <a href="https://github.com/GreenJ84/greenj-readme-statistics/compare">pull request</a> if you have a way to improve this project.
</p>
<p>
  Make sure your request is meaningful, thought out, and that you have tested the app locally before submitting a pull request.
</p>


<h2>💙 Support</h2>
<p>If you like this project, give it a ⭐ and share it with friends!</p>
<p align="left">
  <a href="https://github.com/sponsors/GreenJ84">
    <img alt="Sponsor with Github" title="Sponsor with Github" src="https://img.shields.io/badge/-Sponsor-ea4aaa?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

<!-- [☕ Buy me a coffee]() -->

---

Made with TypeScript, Express, Redis and ❤️‍🔥

<a href="https://render.com/"><img alt="Powered by Render" title="Powered by Render" src="https://img.shields.io/badge/-Powered%20by%20Render-6567a5?style=for-the-badge&logo=render&logoColor=white"/></a>
