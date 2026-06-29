# US Visa Earlier-Appointment Watcher (India · B2)

**Every 30 minutes**, this logs in to your US visa appointment page, checks whether
any slot is available **earlier than your current appointment**, and — if one is —
**automatically reschedules to it and notifies you** (email + SMS). After a successful
reschedule it keeps watching for an even earlier date (configurable). You can also run
it in notify-only mode. Built in **Java 21 + Maven**, using **Playwright** to
drive a real browser, **2Captcha** for reCAPTCHA, **Twilio** for SMS and **SMTP**
for email.

> ⚠️ **Read first — important reality checks**
> - This is for booking **your own** single appointment. It is not a bulk/scalper tool.
> - The portal's terms restrict automated access; you use this at your own risk.
> - India's B2 flow runs on **usvisascheduling.com**, which differs from the older
>   `ais.usvisa-info.com` system that most open-source bots target. The selectors
>   and JSON endpoints shipped here follow the well-documented usvisa-info flow as a
>   **reference** — you must verify/adjust them against your live portal (see step 4).

---

## Architecture

```
App (poll loop, jittered interval, back-off)
 └─ BookingService (one cycle: login? → check facilities → match → book/alert)
     ├─ VisaPortalClient (Playwright: login, session persistence, JSON polling, booking)
     │    └─ CaptchaSolver (2Captcha reCAPTCHA v2)
     ├─ BookingCriteria  (date window + preferred consulates + autoBook flag)
     └─ NotificationService → EmailNotifier (SMTP) + SmsNotifier (Twilio)

PortalConfig — every URL / selector / endpoint, all overridable from config
```

Key design choices:
- **Session persistence** (`storage-state.json`): logs in once, reuses cookies so it
  isn't re-logging-in (or re-solving captcha) on every poll.
- **JSON polling, not HTML scraping**: availability is read from the portal's own
  `/days/{facility}.json` and `/times/{facility}.json` endpoints via the authenticated
  browser context — far more reliable than parsing rendered pages.
- **Everything portal-specific is in one file** (`PortalConfig.java`) and overridable
  from `config.properties`, so you tune selectors without recompiling.
- **Polite polling**: 3-min default interval + random jitter + exponential back-off on
  errors, to avoid tripping rate limits / IP bans.

---

## Setup

### 1. Prerequisites
- Java 21+ and Maven 3.9+ (`java -version`, `mvn -version`)

### 2. Configure
```bash
cd visa-booker
cp config.example.properties config.properties
# edit config.properties — credentials, search window, notifications
```

### 3. Install the Playwright browser (one time)
```bash
mvn -q exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install chromium"
```

### 4. Tune to YOUR portal (the part that needs your eyes)
Because India's portal markup can differ from the defaults, do this once:
1. Log in to your visa portal manually in Chrome.
2. Open **DevTools → Network**, navigate to the appointment page, and watch the XHR
   calls. Note the domain and the URL shape for the availability/day requests.
3. Open **DevTools → Elements** and copy the real selectors for: email field,
   password field, sign-in button, consulate dropdown, date input, time dropdown,
   submit button.
4. Put the domain in `portal.baseUrl`, the consulate IDs in `portal.facilities`,
   your `portal.scheduleId`, and any selectors that differ under the `sel.*` keys.

If your portal's availability endpoints are shaped differently than the usvisa-info
defaults, adjust `daysJsonUrl()` / `timesJsonUrl()` in
`src/main/java/com/visabooker/portal/PortalConfig.java`.

### 5. Run
```bash
./run.sh
# or:
mvn -q exec:java
# or build a jar:
mvn -q package && java -jar target/visa-booker.jar
```

Start with `search.autoBook=false` and `browser.headless=false` so you can **watch**
it work and confirm it detects slots correctly. Flip `autoBook=true` only once you
trust it.

---

## Configuration reference

All keys live in `config.properties` (or as `UPPER_SNAKE_CASE` env vars). See
`config.example.properties` for the annotated full list. Highlights:

| Key | Meaning |
|---|---|
| `portal.email` / `portal.password` | Your portal login |
| `portal.baseUrl` | Your portal domain (verify!) |
| `portal.scheduleId` | Your existing appointment/schedule id (from the URL) |
| `portal.facilities` | `id=Name,id=Name` consulate map |
| `appointment.currentDate` | Your current appointment date — only earlier slots are booked (auto-detected if blank) |
| `search.earliest` / `search.latest` | Lower bound (default today) / optional upper cap |
| `search.autoBook` | `true` = auto-reschedule (default), `false` = alert only |
| `search.keepChasing` | `true` = keep hunting even-earlier dates after a reschedule |
| `poll.intervalSeconds` | Base poll interval (default 1800 = 30 min) |
| `captcha.mode` | `manual` (free) / `audio` (free, automated) / `2captcha` (paid) / `none` |
| `captcha.apiKey` | 2Captcha key — only when `captcha.mode=2captcha` |
| `email.smtp.*` / `email.to` | Email alerts (Gmail App Password) |
| `twilio.*` | SMS alerts |

---

## What you need to provide

1. **Portal account** — email + password (you said you have an account, not yet booked ✅).
2. **Your scheduleId + consulate IDs** — copied from the portal once logged in.
3. **Captcha solving** — three free/paid options:
   - **`audio`** (free, automated): uses [sarperavci/GoogleRecaptchaBypass](https://github.com/sarperavci/GoogleRecaptchaBypass)
     to solve the reCAPTCHA *audio* challenge with speech-to-text. The app launches
     Chromium with a CDP debug port and a small Python sidecar
     (`python-captcha/solve.py`) **attaches to that same browser** to solve the captcha
     inside your authenticated session. One-time setup: `./setup-captcha.sh`
     (needs `python3` + `ffmpeg`). If a solve fails it falls back to manual.
   - **`manual`** (free): app pauses, rings the terminal bell, brings the browser to
     front; you tick the box once and it continues. Good for occasional/attended use.
   - **`2captcha`** (paid): fully unattended via the 2Captcha API key.

   > Note: Google may rate-limit/block an IP that solves many audio captchas quickly.
   > Combined with cached sessions (captchas are infrequent) this is usually fine for
   > personal use, but if `audio` starts failing, fall back to `manual`.
4. **Gmail App Password** — for email alerts (`myaccount.google.com/apppasswords`).
5. **Twilio account** — SID, auth token, a Twilio number — for SMS alerts.

Items 3–5 are optional; the app degrades gracefully and logs which channels are active.

---

## Troubleshooting
- **"Login appears to have failed"** → your `sel.loggedIn` selector or credentials are off.
- **Days endpoint returns 404/302** → your portal's endpoint shape differs; adjust
  `PortalConfig.daysJsonUrl()` or check `portal.scheduleId`.
- **reCAPTCHA present but no solver configured** → set `captcha.apiKey`.
- **Getting rate-limited** → increase `poll.intervalSeconds`.

## Disclaimer
For personal use to book your own appointment. Respect the portal's terms and applicable
law. The authors provide no warranty.
