# Deploy

This repository contains a static site. To deploy to Vercel:

1. Import the GitHub repository into Vercel (https://vercel.com/new)
2. Set the root directory to the repository root
3. Vercel will detect a static site and deploy automatically

Or deploy from your machine using Vercel CLI:

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# From repository root
vercel --prod
```
