# GreenJ ReadMe Statistics

This project is utilizes: TypeScript, JSON and GraphQL languages along with Node.js, Express.js, Apollo Client, Format.js, and Helmet.js libraries.

This project has a cloud Redis database and is deployed as a Docker container on [Render](https://render.com/) cloud hosting

## Quick implementations
platform - Platforms supported are Github, Leetcode, and Wakatime

route - Each platform has specific statistics that it can show with a route for each stat type

username - The username requested is based on the Username for the platform you are trying to reach. If you have diffeent usernames per platform you will need the corresponding username with the correct platform you are requesting. 

```
[Image Description](https://greenj-readme-stats.onrender.com/<platform>/<route>/<username>)
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
        alt= "Image Description: (ex. '<Username><Platform Name><Stats Type>') "
    />
</picture>
```

## Descriptions
<p>
    ⚡ GitHub </br>
    - GitHub is a web-based platform that provides a powerful set of tools for software developers to collaborate on projects. It is primarily used for version control, which means that it helps developers keep track of changes made to code over time. With GitHub, developers can easily contribute to open-source projects, create and manage repositories - public or private depending on the developer's preference, and collaborate with other developers around the world.
    - Find out more about the details of the Github and the routes for it on this API <a href="./src/github/Github_Info.md">here</a>
</p>
<p>
    ⚡ Leetcode </br>
    - LeetCode is a online platform to help you enhance your skills, expand your knowledge, prepare for technical interviews, and practice your programming skills by solving coding questions. It has over 1,100 different problems, support for over 18 programming languages, and an active community that is always there to help you with the solutions you come up with. If your intention is to hone your coding skills, then this online platform is one of the best that you can use.
    - Find out more about the details of the Leetcode and the routes for it on this API <a href="./src/leetcode/LeetCode_Info.md">here</a>
</p>
<p>
    ⚡ WakaTime </br>
    - WakaTime is a productivity tracking tool designed specifically for developers, committed to making time tracking fully automatic for every programmer. It integrates with a variety of development tools, such as editors and IDEs, to track the time that developers spend on various coding tasks and provide detailed insights into developers' coding habits. The insights include the languages and frameworks they use most frequently, how much time they spend on specific tasks, and how productive they are overall to helps developers identify areas where they can improve their productivity and get back to what matters most: creating amazing software.
    - Find out more about the details of the WakaTime and the routes for it on this API <a href="./src/wakatime/WakaTime_Info.md">here</a>
</p>

## Usage

This API is meant to be a simple development statistics display for User's looking to attatch to personal profiles

## License
This project is licensed under the MIT License - see the [LICENSE.md](/License.md) file for details.

The MIT License is a permissive license that allows users to use, copy, modify, merge, publish, distribute, and sublicense the software, provided that they include the original copyright notice and disclaimer. It also provides an implied warranty of fitness for a particular purpose and limits the liability of the software's authors and contributors.

By using or contributing to this project, you agree to be bound by the terms and conditions of the MIT License.

If you have any questions about the license or would like to use this software under a different license, please contact the project maintainers.

## Local Development

To run the server locally, you need to download the code from this repository to your local maching and then enter the project folder: 
```
git clone https://github.com/GreenJ84/github-readme-streak-typescript.git

cd github-readme-streak-typescript
```


then you can use the following command:
```
npm run dev
```

This will start the server using ts-node and you will be able to access it at http://localhost:8000 (Note: If you intend to contribute to this project, plese first view the [Contribution Guide](https://github.com/GreenJ84/GreenJ84/blob/main/profile_contributions.md.md#profile-contributions-guidline))

## Deployment


## 🤗 Contributing

Contributions are welcome! 

Please refer to my profile [Code of Conduct](https://github.com/GreenJ84/GreenJ84/blob/main/profile_code_of_conduct.md#contributor-code-of-conduct) for before contributing to this project.

My [Contribution Guide](https://github.com/GreenJ84/GreenJ84/blob/main/profile_contributions.md.md#profile-contributions-guidline) has more details on how to Get Started contrubitung

 Feel free to at any time [open an issue](https://github.com/GreenJ84/github-readme-streak-typescript/issues/new/choose) or submit a [pull request](https://github.com/GreenJ84/github-readme-streak-typescript/compare) if you have a way to improve this project.

Make sure your request is meaningful, thought out and you have tested the app locally before submitting a pull request.

## 🙋‍♂️ Support

💙 If you like this project, give it a ⭐ and share it with friends!

<p align="left">
  <a href="https://github.com/sponsors/GreenJ84">
    <img alt="Sponsor with Github" title="Sponsor with Github" src="https://img.shields.io/badge/-Sponsor-ea4aaa?style=for-the-badge&logo=github&logoColor=white"/>
  </a>
</p>

[☕ Buy me a coffee]()

---

Made with TypeScript, Express, Redis and ❤️‍🔥

<a href="https://render.com/"><img alt="Powered by Render" title="Powered by Render" src="https://img.shields.io/badge/-Powered%20by%20Render-6567a5?style=for-the-badge&logo=render&logoColor=white"/></a>