# Mlondolozi.dev

A professional portfolio for Mlondolozi Zondi, presenting enterprise systems,
validation, integration, software, and cloud engineering work. The main route is
a fast recruiter-friendly portfolio; `/experience` is an optional immersive
Three.js experience loaded as a separate bundle.

## Stack

- React 19 and TypeScript
- Vite
- Framer Motion
- Three.js and React Three Fiber for the immersive route
- EmailJS for the enquiry form

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

## MLO.OS Interactive Experience

The existing portfolio remains at `/`. The immersive Three.js experience is isolated at:

```txt
/experience
```

The app also detects an `experience.*` hostname, so the same build can be deployed to
`experience.mlondolozi.dev` without replacing the main portfolio.

## Vercel Deployment for experience.mlondolozi.dev

1. Import this repository into a separate Vercel project.
2. Use the Vite preset, `npm run build`, and `dist` output directory.
3. Add `experience.mlondolozi.dev` as the project's custom domain.
4. Point the subdomain DNS record to Vercel as instructed in the project dashboard.

The hostname detector will render MLO.OS at the subdomain root. `vercel.json` also keeps direct
`/experience` links working when the build is served from the main domain.

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

The contact popup uses EmailJS from the browser.

Create an EmailJS service and template, then add these Cloudflare Pages environment variables:

```txt
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

These variables are used at build time, so redeploy after changing them.

Recommended EmailJS template variables:

```txt
{{site_name}}
{{to_email}}
{{from_name}}
{{from_email}}
{{phone}}
{{project_type}}
{{message}}
```

### Email You Receive

Use this as the main EmailJS template.

Subject:

```txt
New portfolio enquiry from {{from_name}}
```

To email:

```txt
hello@mlondolozi.dev
```

Reply-to:

```txt
{{from_email}}
```

Body:

```txt
New enquiry from {{site_name}}

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Project type: {{project_type}}

Message:
{{message}}

Reply directly to this email to continue the conversation.
```

### Auto-Response Email

Use this as the EmailJS auto-reply template.

To email:

```txt
{{from_email}}
```

Subject:

```txt
Thanks for reaching out to Mlondolozi.dev
```

Body:

```txt
Hi {{from_name}},

Thanks for reaching out through Mlondolozi.dev. I received your message and will review the details you shared.

If your request is urgent, you can call or WhatsApp me on +27 68 140 2763.

Summary of your enquiry:

Project type: {{project_type}}

Message:
{{message}}

Regards,
Mlondolozi Zondi

Enterprise systems + integration engineer
hello@mlondolozi.dev
```
