# Sangha Prarthana Yatra

A weekly quiz to help memorise the Sangha Prarthana, stanza by stanza, with a
gana leaderboard (team + individual) backed by Firestore.

## Local development

```bash
npm install
npm run dev
```

## Firestore setup

This app writes to a single collection: `sangha-prarthana-scores`.
No manual collection creation is needed — Firestore creates it on first write.

1. In the [Firebase Console](https://console.firebase.google.com), open your
   project (`shakha-feedback`) → **Firestore Database** → **Rules**.
2. Paste in the contents of `firestore.rules` from this repo and publish.
   This keeps the collection open (no login required) but validates that
   every write has a real name, a valid gana, and numeric scores, and blocks
   edits/deletes of existing entries.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds the app and
   publishes it automatically. Your site will be live at
   `https://<username>.github.io/<repo-name>/`.

## Adding a new week

Edit `src/data/weeks.js` — add questions and `matchPairs` for the next
stanza pair and flip `unlocked: true`. Nothing else needs to change; the
leaderboard picks up new weeks automatically.
