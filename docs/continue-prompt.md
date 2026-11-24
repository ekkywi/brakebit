# Continue prompt (copy-paste)

Tempel blok di bawah ini ke chat Cursor baru setelah membuka repo Brakebit.

---

```text
Saya lanjutkan proyek Brakebit di repo ini.

Baca dulu dan patuhi:
1. .cursor/rules/collaboration.mdc (gaya kerja dan aturan database)
2. docs/AUTH.md: bagian "Current repo status", "Phase B", dan "Handoff checklist" saja
3. docs/ROADMAP.md: bagian "Partial / next gaps" dan P1 nomor 4 (kredit)
4. docs/STRUCTURE.md hanya jika menyentuh folder baru

Konteks singkat:
- Monorepo pnpm + turbo: apps/web (Next 15), apps/api (NestJS 11), packages/db (Prisma 6 + Neon), packages/shared
- Login: wallet Solana (Phantom) + pesan SIWS-style, session cookie httpOnly
- Kredit: Campaign → CreditLot (punya masa berlaku) + CreditLedger (append-only). Spend memakai lot yang paling cepat kedaluwarsa dulu. Refund 100% jika sistem menilai operasi gagal.
- Guest: 1 live check gratis per hari (belum dibangun)

Status (per tanggal 24 Nov 2026):
- Phase A login: SELESAI. Tes Phantom manual belum dicatat.
- Phase B Langkah 1 (skema, migrasi, seed welcome): SELESAI
- Phase B Langkah 2 (CreditsService): SELESAI, typecheck bersih
- Phase B Langkah 3 (welcome saat login): SELESAI. Tes manual belum dicatat.
- BERIKUTNYA: Phase B Langkah 4 (GuestUsage + gerbang POST /checks)

Mulai dari "BERIKUTNYA", kecuali saya minta topik lain. Cek dulu AUTH.md karena status bisa berubah.
```

---

## Cara pakai

1. Tempel blok di atas ke chat baru.
2. Kalau ada tahap yang selesai, ubah daftar **Status** di file ini, lalu perbarui `docs/AUTH.md` dan `docs/ROADMAP.md`.
3. Gaya kerja (pandu, satu langkah per jawaban, tanya dulu sebelum edit) ada di `.cursor/rules/collaboration.mdc`. Tidak perlu diulang di prompt.
