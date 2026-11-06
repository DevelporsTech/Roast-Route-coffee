# Roast & Route — repaired Android app

The Android app bundles the supplied React interface. The original stylesheet,
Tailwind theme, page layouts, colors, and component styling have been retained.
The app label and coffee icon are retained, as is the original `com.example` app ID.

## Install the app

To install the updated cup and desktop layout, build a fresh APK using the Android steps below.

Download `Roast-Route-Android.apk` onto an Android phone and open it to install.
It supports Android 7.0 and newer. This is a debug-signed APK for testing.

## What was repaired

- Modern JavaScript modules now load from Android's local HTTPS asset loader.
- All current JavaScript, CSS, lazy screens, icons, and original fonts are bundled.
- Android GPS permissions are requested when the GPS feature is used.
- Android Back closes open dialogs and returns to Home before exiting.
- External map, phone, and website links open in the appropriate installed app.
- The mobile map/list controls now switch views correctly.
- The unavailable map tile connection has been replaced with a working street
  basemap; the existing map controls, markers, warm/dark themes, and layout remain.
- Windows-compatible npm build commands, a dependency lockfile, and complete
  Gradle wrapper files are included.
- Unused Android template plugins, Firebase configuration requirements,
  Compose template files, and missing custom debug-key references were removed.

## Run the React project

Install Node.js 20 or newer, then run these commands from this folder:

```sh
npm ci
npm run dev
```

For a checked production build:

```sh
npm run build
npm run preview
```

## Build Android

Install Android Studio, JDK 17, Android SDK Platform 36, and SDK Build Tools 35.0.0.
Open this folder in Android Studio to let it configure the SDK path, or set
`ANDROID_HOME` to your Android SDK location. Then run:

```sh
npm ci
npm run android:debug
```

The APK is written to `app/build/outputs/apk/debug/app-debug.apk`.
This command always rebuilds and copies the complete web app before Gradle runs.
For an Android Studio build, run `npm ci` and `npm run android:sync` in this folder
first. These commands generate the web build and copy it into the Android project.
Run `npm run android:sync` again after changing React code.

For a release bundle, configure your own `KEYSTORE_PATH`, `STORE_PASSWORD`,
`KEY_ALIAS`, and `KEY_PASSWORD` environment variables, then run:

```sh
npm run android:release
```

The bundle is written to `app/build/outputs/bundle/release/app-release.aab`.
Keep your release signing key for future updates. No release key is included.

## Existing functionality and network requirements

The interface, fonts, store catalog, cart, preferences, and saved app state are
available locally. Live maps, remote store photos, GPS fixes, and external
directions depend on network/device availability.

The supplied project uses demonstration login profiles, payment buttons, order
placement, and timed order progression. Those remain demonstrations; this repair
does not connect them to real authentication, payment processing, or cafe systems.

The map source can be configured using `VITE_MAP_TILE_URL` and
`VITE_MAP_ATTRIBUTION` in a local `.env` before rebuilding. Supply an XYZ tile URL
and the attribution required by your chosen provider. The default street basemap
uses the public Esri service with its source attribution displayed on the map.

## Validation

- TypeScript checking, Vite production build, and sync into Android assets.
- Desktop and phone layout checks with automatic cup artwork and flavor switching.
- Interactive 3D validation requires a WebGL-enabled browser.
