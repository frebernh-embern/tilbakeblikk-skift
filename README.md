# Tilbakeblikksfilm – Skiftplan (August-stevnet)

En liten web-app hvor teamet melder seg på filmskift. Moderne, mobilvennlig, og
med varsler 1 time og 15 minutter før hvert skift man er meldt på.

Filene i mappen:

| Fil | Hva det er |
|-----|------------|
| `index.html` | Selve appen |
| `firebase-config.js` | Her limer du inn databasenøklene (steg 1) |
| `sw.js`, `manifest.json` | Gjør appen installerbar på mobil (PWA) |
| `header.jpg`, `icon-192.png`, `icon-512.png` | Bilder |
| `README.md` | Denne veiledningen |

---

## Hvorfor trengs et "database"-steg?

En ren HTML-side på GitHub kan ikke huske noe på tvers av folk av seg selv –
hver telefon ville hatt sin egen liste. For at **alle skal se de samme
påmeldingene**, kobler vi på en gratis database fra Google som heter
**Firebase Firestore**. Det krever ingen server og ingen kortopplysninger.

> Uten dette steget kjører appen fint, men påmeldinger lagres bare lokalt på
> hver enhet (appen sier ifra med en gul melding øverst).

---

## Steg 1 – Lag gratis Firebase-database (ca. 5 min)

1. Gå til <https://console.firebase.google.com> og logg inn med Google-konto.
2. Klikk **"Create a project"** / **"Legg til prosjekt"**. Gi det et navn, f.eks.
   `tilbakeblikk-skift`. Du kan hoppe over Google Analytics. Klikk **Create**.
3. I menyen til venstre: **Build → Firestore Database → Create database**.
   - Velg **Start in test mode** (enklest – se sikkerhetsnote nederst).
   - Velg region (f.eks. `eur3 (europe-west)`). Klikk **Enable**.
4. Klikk tannhjulet øverst ⚙️ → **Project settings**.
5. Scroll ned til **"Your apps"** → klikk web-ikonet **`</>`**.
   - Gi appen et kallenavn, klikk **Register app** (hopp over Hosting).
   - Nå vises en `firebaseConfig` med noen linjer. **Kopier verdiene.**
6. Åpne `firebase-config.js` i denne mappen og lim inn verdiene, slik:

   ```js
   window.firebaseConfig = {
     apiKey: "AIza…",
     authDomain: "tilbakeblikk-skift.firebaseapp.com",
     projectId: "tilbakeblikk-skift",
     storageBucket: "tilbakeblikk-skift.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456"
   };
   ```

Det er alt. Nå deles påmeldingene mellom alle som åpner appen. 🎉

---

## Steg 2 – Legg appen på GitHub + GitHub Pages (gratis nettadresse)

**Enkleste vei (uten kommandolinje):**

1. Lag konto på <https://github.com> hvis du ikke har.
2. Klikk **New repository**. Navn f.eks. `tilbakeblikk-skift`. Sett den til
   **Public**. Klikk **Create repository**.
3. På repo-siden: **Add file → Upload files**. Dra inn **alle filene** fra denne
   mappen (index.html, firebase-config.js, sw.js, manifest.json, header.jpg,
   icon-192.png, icon-512.png). Klikk **Commit changes**.
4. Gå til **Settings → Pages**.
   - Under **Source**: velg **Deploy from a branch**.
   - Branch: **main**, mappe: **/ (root)**. Klikk **Save**.
5. Vent ~1 minutt. Øverst på Pages-siden dukker adressen opp, typisk:
   `https://<brukernavn>.github.io/tilbakeblikk-skift/`
6. Del den lenken med teamet. Ferdig! 🎬

**Oppdatere senere:** last opp ny `index.html` samme sted (Add file → Upload),
så oppdateres siden automatisk.

---

## Steg 3 – Slik bruker teamet appen (på mobil)

1. Åpne lenken i **Chrome (Android)** eller **Safari (iPhone)**.
2. Skriv inn navnet sitt øverst → **Lagre**.
3. Trykk **Meld på** på skiftene de skal ta. (Trykk igjen for å melde av.)
4. Trykk **🔔 Slå på varsler** og godta.
5. **Installer appen på hjemskjermen** for at varslene skal fungere best:
   - **iPhone/Safari:** Del-knappen → *"Legg til på Hjem-skjerm"*.
   - **Android/Chrome:** meny (⋮) → *"Installer app"* / *"Legg til på startskjerm"*.

---

## Om varslene – viktig å vite

Appen bruker **lokale varsler**: den planlegger en beskjed 1 time og 15 min før
hvert skift du er meldt på. Dette fungerer så lenge appen er **installert på
hjemskjermen og har fått lov til å varsle**.

Begrensning: helt garanterte varsler selv når telefonen har vært avslått eller
appen aldri åpnes, krever ekte "push"-varsler via en server. Det kan vi legge
til senere hvis dere ønsker (Firebase Cloud Messaging) – men for de fleste holder
løsningen her fint, spesielt om folk åpner appen daglig under stevnet.

Tips: be teamet åpne appen én gang om morgenen, så er alle dagens varsler
planlagt.

---

## Sikkerhet (valgfritt, men lurt)

I "test mode" er databasen åpen for alle i 30 dager. Siden dette bare er navn på
filmskift er det lav risiko, men to enkle grep:

- **Sett en sluttdato / lås ned** i Firestore under **Rules**. Eksempel som kun
  tillater lesing/skriving i `signups`-samlingen:

  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /signups/{doc} {
        allow read, write: if true;   // bytt til strengere regler ved behov
      }
    }
  }
  ```

Trenger du hjelp til å stramme dette, si ifra.

---

## Endre skiftene

All skiftdata ligger øverst i `index.html` i listen `SHIFTS`. Hvert skift har
dato, tid, tittel, sted, antall personer (`need`) og drone (true/false). Rediger
der og last opp på nytt.
