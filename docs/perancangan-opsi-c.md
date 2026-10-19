# Perancangan Opsi C — "Quiet Authority"

Tanggal: 15 Oktober 2026 · File: `opsi-c/index.html` (sumber: `opsi-c/index.src.html`)

Konsep: perpaduan **modern, elegan, smart, trusted**. Kebersihan dan motion halus dari Fleava, ketenangan editorial dan nada "trusted advisor" dari Egon Zehnder, alur dua audiens dari Michael Page. Brand tetap dari guideline: Jade sebagai warna utama, Lime hanya sebagai aksen, Night untuk section gelap, General Sans + Cabinet Grotesk, dan motif Puzzle (kotak · lingkaran · bar).

## 1. Prinsip visual

| Hal | Keputusan |
|---|---|
| Ruang | Whitespace lega, garis hairline 1px, grid 1:3 (label kiri, konten kanan) ala Egon Zehnder |
| Tipografi | Judul besar General Sans 500, tracking rapat (−0.04 s/d −0.05em); label bernomor "(01) Who we are" ala Fleava |
| Warna | Dominan putih + Night; Jade untuk aksi & kata kunci; Lime hanya di titik kecil, angka, dan CTA penutup |
| Sudut | Gambar & kartu radius 16–28px; tombol pill |
| Motion | Hanya `transform`, `opacity`, `clip-path`; easing `cubic-bezier(0.16, 1, 0.3, 1)` |

## 2. Struktur homepage

| # | Section | Interaksi & motion |
|---|---|---|
| 0 | Preloader | 5 potongan logo menyatu, wordmark naik, progress bar tipis; tirai terangkat (clip-path) |
| 1 | Hero | Judul per baris dengan mask; kata Jade berganti ("everything / the team / the market") |
| 1b | Finder (pola MP) | Tab "I'm looking for a job" / "I'm hiring talent" dengan pill bergeser; form kata kunci + industri, atau peran + senioritas |
| 1c | Hero media | Foto membuka dari inset ber-radius menjadi full-bleed saat scroll; kartu kaca "70%+ match" |
| 2 | Ticker | Marquee industri dengan pemisah bentuk logo; berhenti saat hover |
| 3 | Who we are | Paragraf terisi per kata saat scroll; kata "puzzle / piece / whole" berwarna Jade |
| 4 | Dua jalur | Kartu Companies (Jade) & Talent (Lime); foto reveal clip-path, hover zoom + tint, panah berputar |
| 5 | Angka | 2018 · 6 · 10 · 70%+ dengan counter |
| 6 | Approach (gelap) | Judul sticky; langkah aktif menyala; ikon logo terisi potongan per langkah |
| 7 | Services | Baris editorial; hover: garis tergambar, judul bergeser, foto preview mengikuti kursor |
| 8 | Hunters | Rail geser (drag/panah/scroll-snap), foto grayscale → warna saat hover, progress bar |
| 9 | Insights | Grid editorial: 1 artikel utama + 3 baris |
| 10 | CTA (gelap) | "Let's find the piece that fits." — potongan logo menyatu menjadi logo seiring scroll |
| 11 | Footer | Kolom tautan + wordmark raksasa yang naik saat terlihat |

Global: header transparan → blur saat scroll, sembunyi saat scroll turun, berubah gelap di atas section gelap, nav aktif mengikuti section; tombol magnetic dengan fill dari bawah; Lenis smooth scroll; drawer menu di mobile.

## 3. Teknis

- HTML/CSS/JS vanilla (tanpa GSAP), Lenis 1.1.20 opsional. Memakai ulang `css/tokens.css` dan `js/data.js`.
- `prefers-reduced-motion`: tanpa preloader, reveal, dan scrub; konten langsung tampil.
- Build mandiri: `python3 tools/build_embed.py opsi-c/index.src.html opsi-c/index.html`.

## 4. Copy baru (perlu persetujuan)

"The right people change everything.", "Placing leaders across six countries…", paragraf "Who we are", "Build the team your strategy needs." / "Find the role that fits who you are.", "A search built on evidence, not luck.", judul 5 langkah Approach, "Services shaped around your hire.", "The people behind every placement.", "Perspectives on talent & leadership.", "Let's find the piece that fits.", serta nama layanan "Contingency Search" / "Project-Based Hiring" / "Tailored Solutions".
