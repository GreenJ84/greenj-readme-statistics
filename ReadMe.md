# 🌟 GreenJ ReadMe Statistics 🌟

This is an Express server application built to query the personal profile data of a User's from [GitHub](https://www.github.com), [LeetCode](https://www.leetcode.com), and [WakaTime](https://www.wakatime.com) platforms. The server stores queried data in a Redis cloud database for 16 hrs and provides the ability to receive these statistics in an aesthetic SVG modal. This server also has an option for a User to register on each route to have the statistics refreshed on an 8hr interval.

This project is utilizes:
- A ExpressJS server architecture written in TypeScript with NodeJS and HelmetJs.
- A simple front-end display that utilizes CSS and vanilla JavaScript. 
- Personal development data retrieved via REST API and GraphQL quieries to 3rd party API services and cached in a Redis cloud database.
- The Jest testing framework and Postman services for functional and API testing.
- A GitHub CI/CD pipeline with Render to test code and deployment success for all main branch changes against production.
- Docker containerization for functional testing of production environments and production deployment. 

This project has a cloud Redis database and is deployed as a Docker container on [Render](https://render.com/) cloud hosting

<p align="center">
    <img width="700" height="500" src="https://github.com/GreenJ84/github-readme-stats-typescript/raw/main/public/assets/projectDisplay.png" alt="API Modal Previews" />
</p>

## 🔍 Quick Image implementations

```
[Image Description](https://greenj-readme-stats.onrender.com/<platform>/<route>/<username>)
```

platform - Platforms supported are Github, Leetcode, and Wakatime

route - Each platform has specific statistics that it can show with a route for each stat type

username - The username requested is based on the Username for the platform you are trying to reach. If you have diffeent usernames per platform you will need the corresponding username with the correct platform you are requesting. 


## 🔬 Advanced Image Implimentations:
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

## 📖 Descriptions
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

## 🔨 Usage

This API is meant to be a simple development statistics display for User's looking to attatch their own development statistics to their personal profiles.

Each individual platform has an informational markdown sheet providing further details for utilizations and optimizations for its own specific routes and modals. Use the links following to find the Informational Markdown pages for each platform: [GitHub](./src/github/Github_Info.md), [LeetCode](./src/leetcode/LeetCode_Info.md), [WakaTime](./src/wakatime/WakaTime_Info.md)

Global theme options, color options, and parameter options common to all routes and modals can be found [here](./src//Server_Details.md)

## 🪪 License
This project is licensed under the MIT License - see the [LICENSE.md](/License.md) file for details.

The MIT License is a permissive license that allows users to use, copy, modify, merge, publish, distribute, and sublicense the software, provided that they include the original copyright notice and disclaimer. It also provides an implied warranty of fitness for a particular purpose and limits the liability of the software's authors and contributors.

By using or contributing to this project, you agree to be bound by the terms and conditions of the MIT License.

If you have any questions about the license or would like to use this software under a different license, please contact the project maintainers.

## 💻 Local Development

*** A [.env file](https://github.com/GreenJ84/github-readme-streak-typescript/blob/main/src/Server_Details.md#environmental-variables-configuration) and a [local Redis connection](https://redis.io/docs/getting-started/) ( or it's replacement/removal) will be required to functionally run the application ***

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

## 🌍 Deployment

*** A [.env file](https://github.com/GreenJ84/github-readme-streak-typescript/blob/main/src/Server_Details.md#environmental-variables-configuration) and a [cloud Redis connection](https://app.redislabs.com/) (or it's replacement/removal) will be required to functionally deploy the application ***

If you can, it is preferable to host the files on your own server.

Doing this can lead to better uptime and more control over customization (you can modify the code for your usage).

There is two options for deploying these TypeScript server files:

Node.js Server:
- These files can be deployed on their own with Node itself. You can find defferent hosting platforms to accomodate an Express Node server deployemen such as [Heroku](www.heroku.com), [A2 Hosting](www.A2Hosting.com), or [HostGator](www.HostGator.com) and more. With some minor modification, this server can also be planted into the /api directory of a Next.js application and deployed to [Vercel](www.vercel.com).

Node runtime commands are:

- Build the JavaScript files
```
npm run build
```
- Run the JavaSript Server
```
npm run start
```

Docker container (my current deployment): 
- These files can be deployed as a Docker container using the provided Dockerfile in the repository that runs on the latest Node.js Image. Great hosting sites for docker containers include: [Render](https://render.com/)(My current deployment platform), [AWS](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/), [Heroku](www.heroku.com), [Sloppy.io](Sloppy.io) and much more.

Container runtime commands are the following:
- Build the docker container
```
docker build -t image-name .
```

- Run the docker container
```
docker run -p 8000:8000 -d image-name
```


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

<!-- [☕ Buy me a coffee]() -->

---

Made with TypeScript, Express, Redis and ❤️‍🔥

<a href="https://render.com/"><img alt="Powered by Render" title="Powered by Render" src="https://img.shields.io/badge/-Powered%20by%20Render-6567a5?style=for-the-badge&logo=render&logoColor=white"/></a>