# Kanban board app

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/daffis-projects/v0-kanban-board-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/fg6f1HetpwN)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   Get these values from your Supabase project settings:
   [https://supabase.com/dashboard/project/_/settings/api](https://supabase.com/dashboard/project/_/settings/api)

3. **Set up the database** (for development):
   - Go to your Supabase dashboard → SQL Editor
   - Run the scripts in order:
     1. `scripts/001_create_kanban_tables.sql` (creates the tasks table)
     2. `scripts/010-make-user-id-nullable-dev.sql` (allows anonymous tasks for development)
     3. `scripts/011-add-notes-column.sql` (adds notes field to tasks)
   
   **Note:** The second script makes `user_id` nullable and allows anonymous operations. This is for development only. In production, you should use proper authentication.

4. Run the development server:
   ```bash
   pnpm dev
   ```

## Deployment

Your project is live at:

**[https://vercel.com/daffis-projects/v0-kanban-board-app](https://vercel.com/daffis-projects/v0-kanban-board-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/fg6f1HetpwN](https://v0.app/chat/fg6f1HetpwN)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
