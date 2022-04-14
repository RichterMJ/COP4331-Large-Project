
<h1 align="center">
    <img src="https://cdn.discordapp.com/attachments/944980484591591474/948288670266437662/thirdLogo.png" alt="GitFit-logo" width="250px"/>
    <br/>
    GitFit
</h1>

<h4 align="center">
    A fitness app to set and meet nutrition goals.
</h4>


# Table of Contents

- [About](#about)
- [Setup](#setup)
- [Authors](#authors)
- [Running](#running)
- [Team](#team)
- [License](#license)


# About

GitFit is a fitness app that works on desktop and mobile. Users can sign up with their email and start tracking their diet. Nutrition profiles are taken from the USDA database, and users can add their own custom foods and recipes.


# Setup


## Tools

Yarn is the preferred package manager (npm should work as well, though).

You'll need a USDA FoodData Central API key. It's free to sign up for an account.

You'll also need to set up a MongoDB database with Atlas and get a connection URI. MongoDB Atlas is required because of the fuzzy-search functionality used (other databases might be compatible with fuzzy-search but it is untested and not directly supported).


## Environment Variables

The environment variables need to match the specs as seen in the file *environment.d.ts*. This project uses dotenv so you can just set a *.env* file in the root of the project, e.g.:

```sh
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb+srv://example.mongodb.net/Example
# and so on...
```


## First Time Running

As with every yarn/npm project, simply run `yarn` from the command-line to download the required node packages.

Then, before running the project for the first time, you must configure the database by running the following:

```sh
yarn run config-db
```

Afterwards you can (build + run)[#running] as normal.


# Running

In development mode:
- Run `yarn run watch` from the root directory to compile + run the API server. Alternatively, one can manually run `yarn run build` followed by `yarn run start`.
- Run `yarn start` from the *frontend* directory to run the React frontent server.

Production mode on Heroku:
- Heroku will automaticlaly run the necessary steps to compile + run the frontend and backend -- simply push to it.


# Team

We are group 16 of Dr. Leinecker's POOSD class.

Our members:
- Hieu Dang
- Kevin Cahalan
- Kyle McKibben
- Noah Seligson
- Michael Richter
- Santiago Gutierrez
- Stephan Hartig


# License
MIT

