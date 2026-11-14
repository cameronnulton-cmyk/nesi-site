# NESI website

Static website for NESI (Nulton Equipment Systems Integration), hosted free on
GitHub Pages at <https://nesiintegration.com>. It is plain HTML and CSS with one
small inline script. There is no framework, no build step, and no dependencies:
edit a file, commit to `main`, and the site updates in a minute or two.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page: hero, services, who it's for, ways to work, how it works, about, consultation form |
| `products.html` | Products page (placeholder "coming soon") |
| `style.css` | All styling and both color themes, shared by both pages |
| `logo-compact-dark.svg` | Header logo (light-on-dark; works on both themes) |
| `logo-full-light.svg`, `logo-full-dark.svg` | Large logo in the hero; swaps automatically for dark mode |
| `favicon.svg`, `favicon.ico`, `favicon.png`, `apple-touch-icon.png` | Browser tab / home-screen icons |
| `CNAME` | Tells GitHub Pages the custom domain. Do not delete. |
| `apps-script/Code.gs` | Reference copy of the Google script that emails form submissions |

## Editing

- **Text:** edit the HTML directly. Section comments in `index.html` mark each part.
  Cards and steps can be added or removed; layouts reflow automatically.
- **Colors:** change the variables at the top of `style.css`. There is a light
  theme ("Glacier") and a dark theme ("Fjord"); the visitor's device setting picks
  one automatically.
- **Icons:** if you replace the favicon files, bump the `?v=2` in the icon links
  in both HTML files so browsers drop the cached old icon.
- **Preview:** open `index.html` in a browser; it works straight from disk.
  The form will only send once the page is on the real site.

## Hosting and domain

- Hosted by **GitHub Pages**, publishing from the `main` branch root
  (repo Settings > Pages). HTTPS is enforced.
- The domain `nesiintegration.com` is registered at **Squarespace**. DNS there has:
  - four `A` records for the root domain pointing at GitHub Pages
    (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153),
  - a `CNAME` for `www` pointing at the GitHub Pages address
    (`<github-username>.github.io`),
  - the Google Workspace email records (MX, SPF, DKIM, verification TXT).
- Verify current values in GitHub's docs and in Squarespace's DNS settings before
  changing anything; mail and the website share the same DNS panel.

## Email

- `sales@nesiintegration.com` is a **Google Group** (named "NESI Sales") on a
  secondary domain in Google Workspace, owned by the account owner. The owner can
  reply "as" it via Gmail's Send mail as setting.
- Mail from a new domain can land in spam. Keep SPF/DKIM set up in Google Admin
  and consider adding a DMARC record (`_dmarc` TXT, `v=DMARC1; p=none;`).

## The consultation form

1. A visitor submits the form on `index.html`.
2. The page sends the fields to a **Google Apps Script web app** (URL in the
   `<form action>`).
3. The script (`apps-script/Code.gs`) emails the submission to the owner, from the
   sales@ address, with Reply-To set to the visitor.

Things to know:

- The script lives in the owner's Google account, not in this repo. `Code.gs`
  here is a reference copy; keep the two in sync.
- **Redeploying:** in the script editor choose Deploy > Manage deployments > pencil >
  Version "New version" > Deploy. Editing the code alone does not change the live
  version. Keep the same deployment so the URL stays the same.
- If a brand-new deployment is created, the URL changes. Paste the new `/exec` URL
  into `<form action="...">` in `index.html`.
- The script needs Gmail permission. Run `testForm` once in the editor to grant it
  and send a test email.
- The hidden `_gotcha` field is a spam trap; leave it in place.
- The browser cannot read the script's reply (cross-origin), so the page shows
  "Thanks" once the request is sent. If submissions stop arriving, check the
  script's Executions page first.

## Handing this off

Everything needed to run the site is in this repo plus three outside accounts:
GitHub (hosting), Squarespace (domain/DNS), and Google Workspace (email and the
form script). A developer needs access to those three, nothing else.
