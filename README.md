This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Demo Setup

The `/demo` page supports two execution paths:

- guided Rigour scenarios
- live public-repo proof mode

For local development, set these env vars:

```bash
DEMO_RUNNER_URL=http://localhost:8080
DEMO_RUNNER_TOKEN=devtoken
GUIDED_SCENARIO_BREACH_REPO=https://github.com/alibaba/OpenSandbox
GUIDED_SCENARIO_HALLUCINATION_REPO=https://github.com/alibaba/OpenSandbox
GUIDED_SCENARIO_MEMORY_REPO=https://github.com/alibaba/OpenSandbox
```

The web app sends `scenarioId` to `rigour-demo-runner`. The runner can then map each scenario to:

- a curated public repo in production
- or a local example project in development via the runner-side `*_PATH` env vars

For fast local testing, point the runner to small local examples such as:

```bash
GUIDED_SCENARIO_BREACH_PATH=/Users/erashu212/Workspace/Projects/rigour-labs/rigour/examples/vibe-messy
GUIDED_SCENARIO_HALLUCINATION_PATH=/Users/erashu212/Workspace/Projects/rigour-labs/rigour/examples/vibe-messy
GUIDED_SCENARIO_MEMORY_PATH=/Users/erashu212/Workspace/Projects/rigour-labs/rigour/examples/vibe-messy
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
