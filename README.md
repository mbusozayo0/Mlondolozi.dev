## Local Development

```powershell
npm install
npm run dev
```

## Production Build

```powershell
npm run build
```

The production output is generated in `dist/`.

## Cloudflare Pages Deployment

Use Cloudflare Pages with GitHub auto deployment.

1. Push this repository to GitHub.
2. In Cloudflare, go to `Workers & Pages`.
3. Choose `Create application`.
4. Choose `Pages`.
5. Connect the GitHub repository.
6. Use these build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
7. Leave the deploy command empty.
8. Deploy.

Cloudflare will automatically deploy new commits pushed to the connected GitHub branch.

Do not set `npx wrangler deploy` as the deploy command for Cloudflare Pages. Pages deploys the built `dist/` folder automatically.

## Contact Form Email

The contact form uses a Cloudflare Pages Function at `/api/contact`.

Create these Cloudflare Pages environment variables:

```txt
RESEND_API_KEY=your_resend_api_key
CONTACT_TO=
CONTACT_FROM=
```

`RESEND_API_KEY` is required. `CONTACT_TO` and `CONTACT_FROM` can be changed later if needed.

In Resend, verify the `mlondolozi.dev` domain before using `hello@mlondolozi.dev` as the sender address.
