# Sleek Music

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?style=flat-square&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev)
[![React](https://img.shields.io/badge/React-19.3%20%28Compiler%29-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Tamagui](https://img.shields.io/badge/UI-Tamagui%20v3-29ABE2?style=flat-square&logo=tamagui&logoColor=white)](https://tamagui.dev)
[![Audio Engine](https://img.shields.io/badge/Audio-RNTP%20v5-ff69b4?style=flat-square)](https://github.com/doublesymmetry/react-native-track-player)
[![Database](https://img.shields.io/badge/Storage-expo--sqlite%20%2B%20Drizzle-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://docs.expo.dev/versions/latest/sdk/sqlite/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

Sleek is a modern, open-source music streaming application designed for speed, elegant UI, and gapless playback. Built with React Native, Expo, Tamagui, and React Native Track Player on the New Architecture with React Compiler.

---

## Table of Contents

- [Previews](#previews)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Quality and Languages](#quality-and-languages)
- [Contributing](#contributing)
- [License](#license)

---

## Previews

### Explore page

![Home Screen](previews/explore.jpg)

### Player

![Player Screen](previews/player.jpg)

[More Previews](previews)

---

## Features

- **Audio Engine**: High-performance playback with background audio support, lockscreen controls, notification control, and headphone hardware remote control.
- **Smart Autoplay**: Continuously fetches and queues related tracks when the active playback queue ends.
- **Interactive Queue**: Drag-and-drop queue reordering with smooth animations, swipe-to-play, swipe-to-remove, and live queue search.
- **Sleep Timer**: Built-in sleep timer with customizable intervals (5 min to 1 hour, or end of current track).
- **Adaptive Streaming**: Choose between 320 kbps (Studio), 160 kbps (Premium), 96 kbps (Standard), 48 kbps (Basic), and 12 kbps (Data Saver) streaming quality.
- **Multilingual Music**: Filter and curate music recommendations across 16 Indian and international languages.
- **Rich Content & Discovery**: Browse Trending songs, albums, and playlists, Latest releases, and curated Top Charts.
- **Universal Search**: Fast search across Songs, Albums, Artists, Playlists, and in-queue items.
- **Lyrics**: In-player lyrics viewer with formatted line rendering.
- **Full Player Controls**: Play, Pause, Skip Next/Previous, Scrubber with buffered progress, Playback speed, Shuffle, Repeat One, and Repeat All.
- **Floating Mini-Player**: Bottom mini-player with quick controls and swipe-to-expand player view.
- **Favorites & Offline Persistence**: Save favorite songs, albums, artists, and playlists locally with `expo-sqlite` and `drizzle-orm`.
- **Modern Design & Theming**: Polished typography, refined spacing, and Auto / Dark (OLED-friendly) / Light modes powered by Tamagui.

---

## Tech Stack

| Category         | Technology                                                   |
| ---------------- | ------------------------------------------------------------ |
| Framework        | Expo (SDK 58), React Native (0.88), React (19.3)             |
| Compiler         | React Compiler (`experiments.reactCompiler`)                 |
| Architecture     | React Native New Architecture (`newArchEnabled`)             |
| UI System        | Tamagui v3, Generated Lucide Icons (`@tamagui/helpers-icon`) |
| Animations       | React Native Reanimated v4                                   |
| Gestures & Lists | React Native Gesture Handler, React Native Reorderable List  |
| Routing          | Expo Router (Typed file-based routing)                       |
| Audio Engine     | React Native Track Player (`@rntp/player`)                   |
| Storage & ORM    | Expo SQLite (`expo-sqlite`), Drizzle ORM (`drizzle-orm`)     |
| State / Fetching | SWR (`swr`), Custom Preference Store                         |
| Tooling          | Bun, TypeScript, Oxlint, Oxfmt                               |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS) or [Bun](https://bun.sh/)
- Android Studio / Xcode configured with Expo Dev Client (native audio modules require custom builds)

### Setup and Run

1. Clone repository:

   ```bash
   git clone https://github.com/LakhindarPal/sleek-music.git
   cd sleek-music
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Launch development build:

   ```bash
   # Start bundler
   bun run start

   # Run on Android
   bun run android

   # Run on iOS
   bun run ios

   # Run on Web
   bun run web
   ```

---

## Available Scripts

| Script         | Command                      | Description                            |
| -------------- | ---------------------------- | -------------------------------------- |
| `start`        | `bunx expo start -c`         | Start Metro bundler with cleared cache |
| `android`      | `expo run:android`           | Launch on Android device / emulator    |
| `ios`          | `expo run:ios`               | Launch on iOS simulator                |
| `web`          | `expo start --web`           | Launch local web preview               |
| `build:web`    | `expo export --platform web` | Export production web build            |
| `typecheck`    | `tsc --noEmit`               | Run TypeScript type checking           |
| `lint`         | `oxlint`                     | Run linter checks                      |
| `lint:fix`     | `oxlint --fix`               | Automatically fix lint issues          |
| `format`       | `oxfmt`                      | Format code using Oxfmt                |
| `format:check` | `oxfmt --check`              | Check code format compliance           |

---

## Quality and Languages

<details>
<summary>View Streaming Quality Options</summary>

| Setting | Bitrate  | Profile    | Description          |
| ------- | -------- | ---------- | -------------------- |
| `_320`  | 320 kbps | Studio     | Maximum fidelity     |
| `_160`  | 160 kbps | Premium    | Balanced performance |
| `_96`   | 96 kbps  | Standard   | Standard streaming   |
| `_48`   | 48 kbps  | Basic      | Mobile data saver    |
| `_12`   | 12 kbps  | Data Saver | Minimum bandwidth    |

</details>

<details>
<summary>View Supported Languages (16 Languages)</summary>

Hindi, Tamil, Telugu, English, Punjabi, Marathi, Gujarati, Bengali, Kannada, Bhojpuri, Malayalam, Urdu, Haryanvi, Rajasthani, Odia, Assamese.

</details>

---

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).
