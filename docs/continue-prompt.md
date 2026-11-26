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
- Landing redesign (putaran 3, 25 Nov 2026): KODE SELESAI, typecheck bersih, sudah dicek di browser (desktop 1280px, 390px, light dan dark). Lembar spesifikasi: satu `.sheet` dengan garis hairline, hero berisi judul besar, field mint, dan strip enam kotak persegi yang menyala berurutan saat mint valid (hanya empat sinyal yang terbaca; LP lock dan likuiditas tetap putus-putus). Section report mengikuti tema (bukan gelap paksa) dengan panduan baca interaktif yang menyorot bagian contoh laporan, section Product dengan tile "6/6", papan enam sinyal dengan panel terisi, titik penutup judul berbentuk kotak. Penutup (CTA) adalah satu baris sheet biasa, bukan band cyan penuh (owner minta sesuai section di atasnya). Grid kedip acak dan canvas dihapus. Tanpa referensi eksternal. Detail di DESIGN.md.
- Dashboard satu desain dengan publik (26 Nov 2026, permintaan pemilik; MEMBALIK aturan "dua tampilan berbeda" di baris berikutnya): `/dashboard/check` dan Overview sekarang spec sheet yang sama dengan halaman publik (`.sheet--flush`, tanpa max-width dan padding di `main`). Komponen bersama baru: `SheetTitle` (baris judul), `CheckResults` (daftar + panel laporan; publik pecah di lg, dashboard di xl karena ada sidebar), `CreditCell` (sel angka cyan berisi saldo kredit, menggantikan `CreditRail`). Strip enam kotak dan kolom tabel kini memakai container query, supaya lebar kolom dashboard dihitung benar. `RecentChecks` hanya punya satu tampilan (varian card dihapus), CSS `screener-toolbar/body/panel` dan `CHECK_TIP` dihapus. Overview: baris judul, kiri rincian Top-up/Promo + tombol, kanan sel angka kredit, lalu strip enam sinyal dan aturan. Detail di DESIGN.md (Layout nomor 2, App shell) dan `anti-slop/audit-003-2026-11-26.md`. Typecheck dan eslint bersih. Belum diuji di browser: seluruh layar member butuh sesi login nyata (pemilik perlu cek lebar 390, 768, 1280, 1536 dan rel ikon sidebar).
- Halaman check (26 Nov 2026, DIGANTI oleh baris di atas): publik dan member sempat DUA tampilan yang berbeda, memakai logika yang sama (hook `useTokenCheck`). Publik `/check` = spec sheet seperti landing: judul "Review a mint" dengan titik persegi, form berlabel, sel angka cyan besar "1 free live check per day", strip enam kotak yang sama dengan hero (menyala saat mint valid), tabel recently-reviewed berbaris tipis. Member `/dashboard/check` = area kerja di shell dashboard: credit rail (saldo asli dari /credits/me, diperbarui setelah tiap check), toolbar kompak dengan tombol "Run check", tabel kartu. Wash gradient dihapus. `TokenCheckForm` dihapus. Detail di DESIGN.md (Layout nomor 2) dan `anti-slop/audit-002-2026-11-26.md`. Typecheck bersih, publik dicek di browser (704px dan 390px), tetapi klik asli (contoh BONK) dan seluruh layar member belum dicoba manual karena butuh sesi login dan mouse sungguhan. Enam sinyal di mana-mana (SIGNALS di product.ts punya key API, nomor = urutan), SignalStrip di report, kotak scan saat loading.
- Dashboard diselaraskan: shell menampilkan sidebar dan header dulu (skeleton di konten saat sesi dimuat), penanda halaman aktif berbentuk persegi, Overview = blok kredit utama + "What one credit buys" (enam sinyal) + aturan, toggle tema 44px di header, drawer mobile dengan focus trap dan fokus kembali ke pemicu, header halaman check member disamakan. Perlu uji manual: logout dan sesi kedaluwarsa. Belum dicek di browser.
- Sidebar dashboard: ikon gambar sendiri di tiap menu (icons.tsx), tanda merek 2x2 persegi, penanda aktif berupa kotak berbingkai + ikon cyan + teks tebal, bisa diciutkan jadi rel ikon di desktop (cookie brakebit_sidebar dibaca di dashboard/layout.tsx, jadi layout dashboard dinamis). Top-up tidak ditampilkan sampai fiturnya ada. Belum dicek di browser.
- Kredibilitas data (keputusan pemilik, 25 Nov 2026, detail di DESIGN.md "Credibility rules"): report menampilkan "N of 6 signals read" di samping skor. Di bawah 3 sinyal terbaca (diputuskan 26 Nov 2026, sebelumnya 4), level jadi "Limited data" dan skor tidak diwarnai aman atau bahaya. Copy "six live signals" dihapus. Sejak 26 Nov 2026 enam sinyal punya sumber data: LP lock dari Rugcheck (dibobot nilai USD, terkunci jika 95% atau lebih, hanya pool dengan LP token; pool dengan persentase di antara 0 dan 100 membuat sinyal Unknown sampai terverifikasi), likuiditas dari DexScreener (jumlah pool Solana). Setiap sinyal tetap bisa Unknown per mint. Sumber holder tambahan (Birdeye/Solscan) ditunda. Belum dicek di browser.
- BERIKUTNYA: perbaiki UI (keputusan pemilik, 26 Nov 2026). Fase B2 (admin guard) dan C (top-up) ditunda sampai pemilik memintanya. Tes manual Langkah 6 di browser tetap pending.

Mulai dari "BERIKUTNYA", kecuali saya minta topik lain. Cek dulu AUTH.md karena status bisa berubah.
```

---

## Cara pakai

1. Tempel blok di atas ke chat baru.
2. Kalau ada tahap yang selesai, ubah daftar **Status** di file ini, lalu perbarui `docs/AUTH.md` dan `docs/ROADMAP.md`.
3. Gaya kerja (pandu, satu langkah per jawaban, tanya dulu sebelum edit) ada di `.cursor/rules/collaboration.mdc`. Tidak perlu diulang di prompt.
