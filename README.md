# Oost-Marokko Vastgoed — website

Next.js-website die woningen rechtstreeks uit je Supabase-database toont
(regio's Saidia, Berkane, Oujda). Werkt samen met het schema uit
`supabase-schema.sql`.

## Live zetten zonder terminal (GitHub + Vercel)

1. Maak een nieuwe repository op github.com (knop "New"), bijv. genaamd
   `oost-marokko-vastgoed`. Laat hem leeg (geen README aanvinken).
2. Op de repository-pagina: klik "uploading an existing file" en sleep
   alle bestanden en mappen uit deze zip naar dat scherm. Commit.
3. Ga naar vercel.com, log in met dezelfde GitHub-account.
4. Klik "Add New… → Project", kies je zojuist geüploade repository.
5. Bij "Environment Variables" voeg je toe:
   - `NEXT_PUBLIC_SUPABASE_URL` = jouw project-URL uit Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = jouw publiceerbare sleutel uit Supabase
6. Klik "Deploy". Na 1-2 minuten krijg je een live link
   (bijv. `oost-marokko-vastgoed.vercel.app`).

Zodra je in Supabase een rij toevoegt aan de `properties`-tabel met
`is_published = true`, verschijnt die woning binnen 60 seconden live
op de site (geen herdeploy nodig).
