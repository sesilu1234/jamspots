# Jamspots 🎵

Jamspots is a web app for finding and joining local jam sessions, whether you are looking for a place to play, a place to listen, or a way to host something yourself. 🎸

The idea is simple: music events happen all the time, but they are not always easy to find. Jamspots brings them into one place so people can discover what is happening nearby and decide quickly if they want to join. ✨

## What it does 🔎

Jamspots helps users:

- discover jam sessions and open mics in different cities and neighborhoods 🗺️
- browse events through an interactive map
- filter sessions by location, date, and type 🧭
- create and manage sessions as a host 🎤
- share updates and context around each session 💬
- support recurring weekly events 🔁

## Problems it tries to solve 💡

A lot of local music gatherings are shared informally through word of mouth, private chats, or scattered posts. That makes them hard to find and easy to miss. 

Jamspots aims to make that discovery process simpler by giving users a clear, searchable, location-based experience. 🌍

## How it works ⚙️

The app combines a frontend experience with a backend data layer:

- users can browse and search for sessions
- hosts can create and manage their own events
- sessions are stored and retrieved through a database-backed workflow
- location and map-based interactions make it easier to discover nearby activities

## Stack 🛠️

The project is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- NextAuth
- Google Maps / map-based UI
- Radix UI

## Project structure 📁

- app/ — main pages and route-level app logic
- components/ — reusable UI and feature components
- lib/ — helpers, integrations, and shared logic
- app/api/ — server-side routes and backend operations
- types/ — shared TypeScript types

## Getting started 🚀

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Then open http://localhost:3000.

## Notes ✌️

This project is meant to be practical and user-focused rather than purely academic. It is built around a concrete use case and a fairly straightforward product experience. 🎶
