# Flags of the World

This is a simple game that requires you to guess the flags of the world.

![Screenshot of game](https://github.com/kavfixnel/flags-of-the-world/blob/main/game_screenshot.png?raw=true)

## Run in dev mode

```bash
npm start
```

## Run the tests

```bash
npm test
```

The suite covers the guess matching and alias table, the persisted-state hook,
the hint placeholder and the game loop. It runs in watch mode locally and once
through on CI.

## To deploy the app

This app is deployed with GitHub pages on https://kavfixnel.github.io/flags-of-the-world/

Every push to `main` is tested, built and published to the `gh-pages` branch by
`.github/workflows/ci.yml`, so a merged pull request goes live on its own. To
publish from your machine instead:

```bash
npm run deploy
```

## Backlinks

The images of the flags are pulled from [Flagpedia.net](https://flagpedia.net)

The data in countries.json has been sourced from [Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1)
