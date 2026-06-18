# Easy Password Generator

A simple, privacy-friendly password generator for Android, built with [Ionic](https://ionicframework.com/), [Angular](https://angular.dev/), and [Capacitor](https://capacitorjs.com/).

📲 **Get it on Google Play:** https://play.google.com/store/apps/details?id=net.xiidea.easypass

Passwords are generated entirely on-device using the browser/WebView Web Crypto API (`crypto.getRandomValues`). Nothing is sent over the network and nothing is stored — there is no account, no tracking, and no internet permission required to generate a password.

## Features

- Strong, random passwords from **6 to 255** characters long.
- Toggle which character sets to include:
  - Symbols (`~!@#$%^&*(){|}[]_+=-<>?/':;",.\``)
  - Numbers
  - Lowercase letters
  - Uppercase letters
- Quality options for more usable, harder-to-guess passwords:
  - **Begin with a letter** — passwords never start with a number or symbol.
  - **No similar characters** — excludes look-alikes (`i`, `l`, `o`, `I`, `O`, `0`, `1`, `|`).
  - **All unique characters** — no character repeats in the password.
  - **No sequential characters** — avoids runs like `ab`, `12`, `XY`.
- Guarantees at least one character from each enabled set.
- One-tap **copy to clipboard**.
- Works offline.

The app is organized into two tabs:

- **Generator** — the main screen with the password and all options.
- **Info** — reference content, including the full symbol set used.

## How it works

All generation logic lives in `src/app/tab1/tab1.page.ts` (`Tab1Page`):

1. `updateSet()` builds the pool of candidate characters from the selected toggles and validates the configuration (e.g. enough characters for "all unique", at least one set selected).
2. `generate()` draws characters using `crypto.getRandomValues`, then force-inserts one character from each enabled set so every set is represented.
3. The result is checked against the "no sequential" and "begin with a letter" rules. If it fails, generation is retried (up to 10 attempts) before reporting that it could not produce a valid password.

If you select options that make a valid password impossible (for example, requesting "all unique" characters longer than the available character pool), the app shows a validation message instead of generating.

## Tech stack

- **Ionic 8** UI components (standalone) + **Angular 18** (standalone components, no NgModules)
- **Capacitor 6** for the native Android wrapper and device APIs (`@capacitor/clipboard`, `@capacitor/haptics`, etc.)
- **Karma + Jasmine** for unit tests

## Development

Prerequisites: Node.js, npm, and the [Ionic](https://ionicframework.com/docs/cli) / Angular CLIs (installed as dev dependencies).

```bash
npm install        # install dependencies
npm start          # run the dev server in a browser (ng serve)
npm run build      # production web build → www/
npm run watch      # rebuild on change (development config)
npm test           # run unit tests (Karma + Jasmine)
npm run lint       # run ESLint
```

Run a single test file:

```bash
ng test --include='**/tab1.page.spec.ts'
```

### Building for Android

After a web build, sync and open the native project with Capacitor:

```bash
npm run build
npx cap sync android     # copy www/ + plugins into the Android project
npx cap open android     # open in Android Studio to run / build the APK/AAB
```

The Capacitor app config (`appId`, `appName`, `webDir`) is in `capacitor.config.ts`.

### Releasing to Google Play (CI/CD)

Pushing a version tag (`v*`) triggers the GitHub Actions workflow in
`.github/workflows/release.yml`, which builds a signed AAB and uploads it to
Google Play:

```bash
git tag v1.0.6
git push origin v1.0.6
```

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for the one-time Play Console and
GitHub secrets setup.

## Project structure

```
src/
  main.ts                  # standalone bootstrap (router + Ionic providers)
  app/
    app.routes.ts          # top-level routes → tabs
    tabs/                  # tab shell + tab routes
    tab1/                  # password generator (core logic)
    tab2/                  # info / reference
  theme/variables.scss     # Ionic theme variables
android/                   # Capacitor Android project
```

## Privacy

The app generates passwords locally and does not collect, store, or transmit any data.

## License

Private project. © Roni Saha.
