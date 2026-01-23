# Force Bridge Form Page Design

## Goal
Add a new page at `/force-bridge-form` that matches the MVP form UI and behavior from the example repo, posts data to a Google Apps Script endpoint, and uses the existing site Header and Footer.

## Architecture
- Add a new Next.js page at `src/pages/force-bridge-form.tsx`.
- Render existing `Header` and `Footer` components for brand consistency.
- Use `getServerSideProps` with `serverSideTranslations(locale ?? "en", ["common"])`.
- Keep changes isolated to the new route and translation files.

## Form UI and Fields
Match the MVP fields and layout:
- Service (required select): options `force_bridge` (Force Bridge) and `godwoken` (Godwoken).
- Wallet Address (required text input).
- Additional Notes (optional textarea).

UI details:
- Centered container (`max-w-2xl mx-auto`) with title and subtitle.
- Required asterisk on labels.
- Red border + helper text for invalid fields.
- Full-width submit button with loading state.
- On success, replace the form with a success panel (checkmark icon, title, message).

## Submission Flow
- Client-side POST directly to Google Apps Script (matches MVP behavior).
- Use a public environment variable: `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL`.
- Request format:
  - `method: "POST"`
  - `redirect: "follow"`
  - `headers: { "Content-Type": "text/plain;charset=utf-8" }`
  - `body: JSON.stringify({ service, walletAddress, additionalNotes })`
- Handle `loading`, `error`, and `isSubmitted` state via React state.
- Disable inputs while loading; show error panel on non-OK response.

## i18n Copy
Add `form.*` keys to `public/locales/en/common.json` and `public/locales/zh/common.json` based on MVP strings:
- `form.title`, `form.subtitle`
- `form.service.label`, `form.service.placeholder`, `form.service.forceBridge`, `form.service.godwoken`, `form.service.required`
- `form.walletAddress.label`, `form.walletAddress.placeholder`, `form.walletAddress.required`
- `form.additionalNotes.label`, `form.additionalNotes.placeholder`
- `form.submit.button`, `form.submit.submitting`, `form.submit.successTitle`, `form.submit.successMessage`, `form.submit.error`

## Environment
Update `.env.example` to include:
- `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=`

## Verification
Manual checks:
1. Visit `/force-bridge-form` and verify Header/Footer render correctly.
2. Submit empty form and verify required validation errors.
3. Submit valid data and confirm the success state appears.
4. Confirm the Google Sheet receives a new row via the Apps Script.
5. Temporarily break the script URL to verify error panel behavior.

## Non-Goals
- No backend proxy or API route.
- No new UI libraries; use Tailwind utilities already in the project.
