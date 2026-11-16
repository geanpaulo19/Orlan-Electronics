# Orlan Electronics website

A seven-page static website for Orlan Electronics, Ref and Aircon Services in Pasig City. The design is built from the supplied UE mark, the Basier Circle and Basier Square fonts, and the details in `orlanelectronics.md`.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, service index with live preview, aircon feature, process, Filipino neighbourhood section, authorized brands with logos, call to action |
| `services.html` | All 14 services with category filters |
| `aircon.html` | Aircon repair, cleaning, and installation, plus scope and FAQs |
| `brands.html` | Authorized service center details for American Home, CHiQ, Skyworth, and Everest |
| `about.html` | The workshop, working principles, and location |
| `contact.html` | Phone, email, Facebook, map, and a service request form |
| `404.html` | Custom not-found page |

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

A local server is recommended so the Google Maps embed, fonts, and image loading behave like the live site. The site is plain HTML, CSS, and JavaScript, with no build step and no dependencies.

## Structure

```text
assets/
  css/styles.css          Design system and all page styles
  js/main.js              Navigation, reveals, service preview, filters, form
  js/config.js            Google Sheets endpoint and form token
  fonts/                  Self-hosted Basier Circle and Basier Square
  img/                    Optimized photography
  img/brands/             American Home, CHiQ, Skyworth, and Everest logos
  logo/                   Dark and light lockups, marks, favicon
  icons/                  Tabler source icons, MIT licensed
  favicon.svg
  apple-touch-icon.png
tools/
  build-icons.mjs         One-time helper that inlines the Tabler icon sprite
google-apps-script/
  Code.gs                 Appends each request to a Google Sheet
  README.md               Five-minute deployment steps
preview/                  Desktop and mobile screenshots of the finished pages
```

The icon sprite is already inlined in each page, so the site has no runtime icon dependency. `tools/build-icons.mjs` is kept for future maintenance; it looks for `<!--ICON_SPRITE-->` placeholders, which have already been replaced.

## Content to check before launch

- **Contact details.** The landlines, mobiles, email, and address come from `orlanelectronics.md`. They appear in the top bar, footer, mobile menu, contact page, and JSON-LD. Search and replace them everywhere if they change.
- **Facebook URL.** The source only gave the page name, so the link currently opens a Facebook search for `Orlan Elektronics`. Replace it with the real page URL when available.
- **Service descriptions.** These are written in plain, general language for the 14 listed services. Confirm the scope matches what the shop actually does, especially installation, component repair, and warranty wording.
- **Authorized brands.** The page states that Orlan Electronics is an authorized service center for American Home, CHiQ, Skyworth, and Everest, as supplied. Confirm the status is current.
- **Map.** The Google Maps query is `744 Avocado St, San Miguel, Pasig` because that resolves to Avocado Street in Barangay San Miguel. Check the pin before publishing.
- **Photography.** The photos are Pexels stock, chosen to represent the type of work and the local area. The street photo is a Manila street scene used as neighbourhood context, not a photo of Avocado Street. Replace it with real shop, team, and street photos when possible.
- **Filipino copy.** Tagalog and Taglish lines are intentional: `Taga-Pasig kami`, `Kumusta ang appliance mo?`, `Tawag o text`, `Salamat!`. Adjust the tone if the shop prefers English only.
- **Brand logos.** The logos are used to identify the four authorized service lines. They come from the brands' websites and dealer materials and remain the trademarks of their owners. Confirm that the shop is comfortable displaying them.

## Request form and Google Sheets

The form validates in the browser and then does one of two things:

1. **Google Sheets connected.** If `sheetsEndpoint` in `assets/js/config.js` is set, the request is posted to a Google Apps Script Web App and appended to a Google Sheet. The visitor sees a `Salamat! Your request is in.` confirmation.
2. **Not configured yet.** If `sheetsEndpoint` is empty, the form opens the visitor's email app with a pre-filled message to `OERAAS@yahoo.com.ph`. This keeps the site usable while the sheet is being set up.

Follow `google-apps-script/README.md` to create the sheet, deploy the script, and paste the `/exec` URL into `assets/js/config.js`. Change the form token in both `Code.gs` and `config.js`. Submit a test request and confirm the row appears.

Important: the endpoint URL and token are visible in the browser. They reduce casual spam but do not make the form private. The site uses a no-CORS request so it works from any static host; the confirmation cannot read the Google response, so check the sheet after the first test.

## Design notes

- **Palette:** navy `#1A2954`, steel blue `#4C74AC`, ice `#80A8DF`, cool paper `#F3F5F8`.
- **Type:** Basier Square for display and numerals, Basier Circle for body and labels.
- **Shape:** a single 2px radius system across buttons, inputs, and media frames.
- **Motion:** scroll reveals, a crossfading service preview, hover states, and native accordions. All motion respects `prefers-reduced-motion`.
- **Responsive:** tested from 320px to 1440px. The navigation switches to a full-height mobile menu at 960px.
- **Accessibility:** axe-core WCAG 2.0 and 2.1 A/AA checks returned zero violations at 1440px and 390px. Form fields have visible labels, inline errors, and focus states. The mobile menu supports Escape and returns focus to its button.
- **Performance:** no frameworks, self-hosted fonts, optimized JPEGs, lazy-loaded below-fold images, and an eager hero image. Layout shift measured near zero.
- **Local imagery:** a lived-in Filipino living room in the hero, a Pasig skyline behind the call to action, a neighbourhood photo and warm home interior in the local section, and a technician on the services page.
- **Authority:** real American Home, CHiQ, Skyworth, and Everest logo tiles on the home and brands pages.

## Social and SEO

- Each page has a unique title and meta description.
- The home page includes `LocalBusiness` structured data with the supplied address, phones, email, service area, and authorized brands.
- Open Graph and Twitter card tags are present on every page.
- Set `og:image` and `twitter:image` to absolute URLs on the live domain before sharing.
- No canonical URL or sitemap is included because no production domain was supplied. Add both when the domain is known.

## Deploy

The folder is ready for any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a traditional web host. Upload the folder contents as-is. `404.html` is recognized by Netlify, GitHub Pages, and most static hosts.

## Credits

Photography from Pexels, free to use under the Pexels license:

- [19776020](https://www.pexels.com/photo/19776020/) lived-in Filipino living room hero
- [6471913](https://www.pexels.com/photo/6471913/) pressure gauges
- [5463576](https://www.pexels.com/photo/5463576/) outdoor unit service
- [32737485](https://www.pexels.com/photo/32737485/) aircon control panel
- [36027861](https://www.pexels.com/photo/36027861/) electronics workbench
- [2343467](https://www.pexels.com/photo/2343467/) kitchen refrigerator
- [5591460](https://www.pexels.com/photo/5591460/) washing machine
- [14614673](https://www.pexels.com/photo/14614673/) wall-mounted television
- [18052704](https://www.pexels.com/photo/18052704/) Manila street scene
- [30821350](https://www.pexels.com/photo/30821350/) warm home interior
- [31445827](https://www.pexels.com/photo/31445827/) Pasig City skyline
- [31869842](https://www.pexels.com/photo/31869842/) technician at work
- [33388382](https://www.pexels.com/photo/33388382/) component-level repair close-up

Brand logos:

- American Home: brand wordmark from an authorized dealer asset.
- CHiQ: [chiq.com](https://www.chiq.com/).
- Skyworth: [skyworth.com.ph](https://www.skyworth.com.ph/).
- Everest: Everest Cooling Systems brand asset from a Philippine dealer.

All brand logos and names remain the property of their respective owners.

Icons from [Tabler Icons](https://tabler.io/icons), MIT licensed.

The Basier fonts were supplied in the project folder. Confirm that the web license covers this deployment before publishing.

The map is a Google Maps embed. Map data and imagery belong to Google and its data providers.
