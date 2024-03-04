# Gunn Alumni Project

[![Netlify Status](https://api.netlify.com/api/v1/badges/abceee98-596b-45f5-8eaf-e306a5f5ab39/deploy-status)](https://app.netlify.com/sites/gunn-alumni/deploys)

This is a student-led project to create an alumni site for Gunn High School, something that suprisingly does not exist yet.
Our site is a Next.js app that uses Typescript, TailwindCSS for frontend, connected to a Supabase project for backend.

Find our site at [alumni.gunnhigh.school](https://alumni.gunnhigh.school/).

Read more information on [our blog](https://blog.gunnhigh.school).

## Prerequisites

If you are completely new to this type of project, check out [this document](https://docs.google.com/document/d/1Gont6hj2_EOZg-2kOcz5mQtMADW-qrpboKmYYU3YVLw/edit?usp=sharing) to see what skills you may want to learn. **Please reach out to any one of your classmates if you need help at any point in this process.**

- [Git](https://git-scm.com/downloads)
- [node (v18)](https://nodejs.org/en/download/)
- pnpm (run command below after installing node):

```bash
corepack enable
```

- (optional) [VSCode ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- (optional) An SQLite editor to view and modify the database data.
- (optional) [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli) to test Supabase schema changes locally.

## Environment Setup

Clone the repo and install dependencies

```bash
git clone https://github.com/gunn-alumni/gunn-alumni.git
cd gunn-alumni
pnpm i
```

Then run the site on localhost:3000

```bash
pnpm run dev
```

To use a local Supabase instance,

```bash
supabase login # this will prompt you to log in through the browser
supabase link --project-ref remafpgrzmuvfqnmgvmn
supabase start
```

Refer to the [Supabase CLI docs](https://supabase.com/docs/reference/cli/) for more.

## Warnings

Do not put sensitive/important/large data in the db.
