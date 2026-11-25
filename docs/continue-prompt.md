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

Status (per tanggal 25 Nov 2026):
- Phase A login: SELESAI. Tes Phantom manual belum dicatat.
- Phase B Langkah 1 (skema, migrasi, seed welcome): SELESAI
- Phase B Langkah 2 (CreditsService): SELESAI, typecheck bersih
- Phase B Langkah 3 (welcome saat login): SELESAI. Tes manual belum dicatat.
- Phase B Langkah 4 (GuestUsage + gerbang POST /checks): SELESAI. Jalur guest sudah diuji (live, 401 guest_limit_reached, cache hit). Jalur user login belum diuji.
- Phase B Langkah 5 (GET /credits/me): SELESAI.
- Phase B Langkah 6 (web): KODE SELESAI, build lolos. Guest memakai /check, user login memakai /dashboard/check (halaman terpisah). User login yang membuka / atau /check dialihkan ke dashboard di server (middleware.ts), sebelum halaman dikirim. Cookie sesi basi dihapus oleh GET /auth/me. Persiapan deploy: web di Vercel, API di Render, custom domain bersama (lihat AUTH.md, Phase D). Setelah guest kena limit lalu login, user dibawa ke /dashboard/check dan ada popup konfirmasi sebelum check berjalan. Saldo ada di menu akun dan Overview, bukan di header marketing. Tes manual alur utama sudah dilakukan pemilik: login lalu redirect, logout, guest kena limit lalu popup lanjut check. Check member dengan kredit nyata belum dicatat.
- Landing redesign: KODE SELESAI, build lolos, belum dicek di browser. Hero memakai grid kotak berkedip acak (GridBackdrop, canvas) dan SignalGrid (enam kotak bernomor mewakili enam sinyal). Aksen platform diganti ke signal cyan (#0B7285 terang, #3DD6F5 gelap). Report preview dipindah ke section sendiri di bawah hero. Section di bawah hero ikut diselaraskan (statis, tanpa gerak): Report dua kolom dengan legenda sinyal, Features satu blok utama plus daftar, nomor kotak `sq-index` untuk sinyal dan langkah, label section sentence case, band datar. Detail dan alasan gerak ada di DESIGN.md.
- Halaman check (publik dan member) diselaraskan: enam sinyal di mana-mana (SIGNALS di product.ts punya key API, nomor = urutan), SignalStrip di report (enam kotak berwarna status, ada isyarat bentuk), kotak scan saat loading, panduan kosong enam kotak bernomor, label sentence case. Belum dicek di browser.
- Dashboard diselaraskan: shell menampilkan sidebar dan header dulu (skeleton di konten saat sesi dimuat), penanda halaman aktif berbentuk persegi, Overview = blok kredit utama + "What one credit buys" (enam sinyal) + aturan, toggle tema 44px di header, drawer mobile dengan focus trap dan fokus kembali ke pemicu, header halaman check member disamakan. Perlu uji manual: logout dan sesi kedaluwarsa. Belum dicek di browser.
- Sidebar dashboard: ikon gambar sendiri di tiap menu (icons.tsx), tanda merek 2x2 persegi, penanda aktif berupa kotak berbingkai + ikon cyan + teks tebal, bisa diciutkan jadi rel ikon di desktop (cookie brakebit_sidebar dibaca di dashboard/layout.tsx, jadi layout dashboard dinamis). Top-up tidak ditampilkan sampai fiturnya ada. Belum dicek di browser.
- Kredibilitas data (keputusan pemilik, 25 Nov 2026, detail di DESIGN.md "Credibility rules"): report menampilkan "N of 6 signals read" di samping skor. Di bawah 4 sinyal terbaca, level jadi "Limited data" dan skor tidak diwarnai aman atau bahaya. Copy "six live signals" dihapus. Dari enam sinyal, hanya empat yang bisa terbaca hari ini: LP lock dan likuiditas belum punya sumber data. Sumber likuiditas dan holder (Birdeye/Solscan) ditunda, belum diputuskan. Belum dicek di browser.
- BERIKUTNYA: tes manual Langkah 6 di browser, lalu Phase B2 (admin guard) jika saya minta

Mulai dari "BERIKUTNYA", kecuali saya minta topik lain. Cek dulu AUTH.md karena status bisa berubah.
```

---

## Cara pakai

1. Tempel blok di atas ke chat baru.
2. Kalau ada tahap yang selesai, ubah daftar **Status** di file ini, lalu perbarui `docs/AUTH.md` dan `docs/ROADMAP.md`.
3. Gaya kerja (pandu, satu langkah per jawaban, tanya dulu sebelum edit) ada di `.cursor/rules/collaboration.mdc`. Tidak perlu diulang di prompt.
