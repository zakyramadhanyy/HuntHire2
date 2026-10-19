# Penyesuaian Micro-interaction & On-site Experience — Opsi B

Tanggal: 15 Oktober 2026 · File: `index.html` (sumber: `index.src.html`, `style.css`, `app.js`)

Layout, konten, dan konsep puzzle Opsi B tidak berubah. Yang disesuaikan hanya interaksi kecil, motion, dan pengalaman selama berada di website, dengan acuan **modern, elegant, smart, trusted**. Referensi: Fleava (motion tenang dan halus) dan Egon Zehnder (orientasi jelas, terpercaya).

## 1. Dari playful ke elegant

| Elemen | Sebelumnya | Sekarang |
|---|---|---|
| Easing umum | `bounce`, `elastic`, `back` | `expo.out` / `expo.inOut` (halus, tanpa pantulan) |
| Intro | Potongan jatuh, berputar, memantul | Potongan naik dan menyatu dengan tenang + counter 0–100 (Fleava), lalu transisi Jade tetap |
| Logo header | Potongan berhamburan dan berputar saat hover | Statis; hanya latar pill yang menguat (guideline: *Do not play around with the logo*) |
| Logo di hero | Masuk dari acak + rotasi 180° | Naik dan muncul berurutan; saat scroll, rotasi dikurangi ke ±20° |
| Puzzle game | Potongan jatuh memantul, kembali elastis, konfeti | Naik halus, kembali dengan expo, selesai ditandai **riak cincin** Jade/Lime/Tiffany |
| Angka | Bentuk muncul dengan putaran 90° | Membesar halus; hover tanpa rotasi |
| Hunters | Foto "pop" dengan rotasi | Clip-reveal dari bawah + zoom-out foto, teks naik bertahap |
| Footer | Potongan jatuh memantul, huruf wordmark melompat saat hover | Potongan turun halus, lempar tanpa pantul; wordmark hanya reveal |
| Petunjuk scroll | Titik berputar | Denyut lembut |

## 2. Micro-interaction baru

- **Tombol**: fill naik dari bawah seperti cairan lalu rata, label "roll" (teks naik, salinan masuk dari bawah).
- **Kursor**: titik kecil → **cincin** di atas link → **disc Lime berlabel** sesuai konteks: *Partner*, *Explore* (hero), *View* (konsultan), *Read* (insights), *Drag* (potongan puzzle). Mengecil saat diklik.
- **Daftar** (menu, industries, insights): item lain meredup, item aktif bergeser; garis atas insights tergambar dari kiri.
- **Link**: garis bawah tergambar dari kiri dan keluar ke kanan (footer, Email/LinkedIn).
- **Accordion**: judul berubah Jade, ikon berputar saat hover.
- **Magnetic**: tarikan dikurangi supaya terasa premium, bukan bermain.
- **Gambar lazy**: fade-in, tidak muncul tiba-tiba.

## 3. On-site experience (smart & trusted)

- **Header pintar**: menyingkir saat membaca ke bawah, kembali saat scroll ke atas.
- **Penanda posisi**: nama section aktif muncul di samping wordmark (How we work, Our approach, Industries, …).
- **Back to top** dengan cincin progres scroll (Egon Zehnder).
- **Transisi halaman**: lima kolom warna brand menutup layar sebelum pindah ke halaman lain; kembali lewat tombol Back tetap bersih.
- **Smooth scroll** sedikit lebih lembut; anchor scroll dengan easing quart.
- **Aksesibilitas**: link "Skip to content", fokus berpindah ke konten utama, `prefers-reduced-motion` tetap dihormati.

## 4. Pemetaan ke tujuan

| Tujuan | Wujud |
|---|---|
| Enhance the Website Experience | Kursor kontekstual, tombol roll, transisi halaman |
| Improve the User Experience | Penanda section, header pintar, back-to-top, skip link |
| Seamless Browsing Experience | Easing seragam, smooth scroll, fade gambar, transisi keluar halaman |
| Create an Engaging Website Experience | Game puzzle & industries tetap, kini dengan feedback yang lebih halus |
| Deliver a Better Digital Experience | Patuh brand guideline, aksesibilitas, reduced motion |

## 5. Build

`python3 tools/build_embed.py index.src.html index.html` (path `css/` dan `js/` di `index.src.html` sudah diperbaiki agar build dari root berjalan).

## 6. Tampilan visual lebih clean (gaya Fleava)

Struktur section dan konsep puzzle tetap sama; yang berubah adalah tampilan visualnya. Semua warna tetap dari brand guideline.

| Area | Sebelumnya | Sekarang |
|---|---|---|
| Header | Pill putih untuk logo, chip Jade/Night, tombol Menu hitam dengan ikon kotak Lime | Logo tanpa pill, dua link teks bergaris bawah, Menu dua garis. Warna mengikuti section (gelap/terang/Lime), dengan strip blur tipis setelah hero |
| Tipografi | Judul General Sans 500, label besar dengan huruf kapital | Judul General Sans Light 300, label kecil 13px dengan penanda kotak Jade 7px |
| Hero | Jade \| Lime penuh, logo Night | Night \| Flash White, Puzzle Jade, teks meta "difference" yang terbaca di kedua sisi |
| Intro | Latar Night | Seperti cover guideline: White, Puzzle Jade, wordmark Night; flood Jade mengendap menjadi panel Night |
| Game | Kartu info putih, garis putus 2px, label kapital tebal | Kartu jadi garis tipis atas-bawah, garis putus 1px, label normal |
| Approach | Bentuk sangat besar | Bentuk ±35% lebih kecil, judul tipis |
| Angka | Bentuk Tea Green besar menimpa angka | Penanda kecil (kotak/lingkaran/bar), angka tipis |
| Services | Latar Tea Green, ikon hitam-Lime | Flash White, ikon garis tipis, Jade saat terbuka |
| Hunters | Mask kotak/lingkaran bergantian | Potret seragam 4:5, grayscale → warna saat hover |
| Insights | Judul tebal, tag Jade tebal | Judul tipis, tag abu dengan penanda Jade |
| Menu | Lima panel Jade/Slate/Night | Panel Night penuh, link tipis besar |
| CTA | Pola titik besar | Pola titik kecil dan tipis, judul tipis |
| Footer | Sepuluh potongan memantul | Satu set (lima) potongan kecil, judul kolom tenang |

## 7. Footer: wordmark & potongan berfisika

- **Wordmark**: di tengah, selebar layar, ±80% terlihat (20% bawah terpotong tepi halaman). Muncul sebagai satu blok yang naik, bukan per huruf, supaya tidak tampak "bertabrakan" di tengah animasi.
- **Potongan**: 10 potongan (dua set Puzzle) dengan proporsi logo, dirapatkan menjadi satu baris di tengah, duduk tepat di atas wordmark.
- **Fisika (Matter.js 0.19.0)**: saat footer terlihat, potongan jatuh satu per satu dan mendarat di barisnya. Saat di-drag lalu dilepas, potongan membawa momentum lemparan, berputar, memantul (restitution 0.38), menggelinding, dan bisa bertumpuk. Lantai, dinding, dan langit-langit menjaga potongan tetap di area footer. Simulasi hanya berjalan saat footer terlihat.
- **Mobile**: potongan bisa disentuh dan ditarik (`touch-action: none` hanya pada potongan, jadi scroll halaman tidak terganggu).
- **Fallback**: tanpa Matter.js atau dengan reduced motion, potongan tampil diam dalam satu baris.

## 8. Siap kirim ke klien: satu file, QA & WCAG mobile

**Satu file mandiri** — `index.html` (±3,6 MB) memuat semua font, foto, artwork Master Piece, GSAP, Lenis, dan Matter.js. Diuji: saat dibuka dan di-scroll sampai bawah, satu-satunya request adalah file itu sendiri (bisa dibuka offline).

**Perubahan ronde ini**
- Statistik (2018 · 6 · 10 · 70%+) menjadi slider di HP: geser dengan snap, kartu berikutnya mengintip, titik indikator (tombol 24×24 px). Desktop tetap 4 kolom.
- Footer: susunan potongan rapi dan tetap (desktop satu baris; HP dua tingkat — kotak & bar di bawah, lingkaran di atas kotak). Fitur "sleep" fisika dimatikan sehingga tidak ada lagi potongan yang melayang saat penopangnya ditarik. Lebar layar berubah → susunan dirapikan ulang.
- Tombol back-to-top di layar sentuh hanya muncul saat scroll ke atas (tidak menutupi konten).
- Pola titik CTA di HP lebih halus.
- Mode reduced motion: hero tampil lebih dulu, header memakai strip terang tetap agar logo selalu terbaca.

**WCAG (diuji di 390 px dan 320 px)**
| Kriteria | Hasil |
|---|---|
| 1.4.10 Reflow | Tidak ada scroll horizontal, termasuk di 320 px |
| 2.5.8 Target size (min 24×24) | Semua tombol/link lolos (link kecil diberi padding; Menu ≥ 44 px) |
| 1.4.3 Kontras | Teks kecil Jade di latar Flash White (±2,7:1) diganti Dark Slate; teks redup di latar gelap ≥ 5:1 |
| Ukuran teks | Terkecil 12 px |
| 1.4.12 Text spacing | Paragraf line-height ≥ 1,4 |
| 2.3.3 Animation from interactions | `prefers-reduced-motion` dihormati; konten lengkap tanpa animasi |

**Catatan perilaku**: potongan puzzle (section "How we work" dan footer) sengaja bisa di-drag, sehingga gesekan jari yang dimulai tepat di atas potongan tidak menggulir halaman; area di sekitarnya tetap bisa di-scroll.

## 9. Struktur baru: index × ref-fleava

Sumber gaya: `docs/ref-fleava.html` (Opsi D yang sudah diretouch brand). Game puzzle "Five pieces" dan statistik dihapus sesuai keputusan klien.

| # | Section | Sumber | Isi & motion |
|---|---|---|---|
| 1 | On Boarding | index (layout seperti layar pembuka hunthire.id) | Latar Lime #C1FF04, wordmark Night di tengah, counter kecil 0–100 di bawah tengah; pola Master Piece tone-on-tone (Jade multiply tipis) muncul bentuk demi bentuk selama memuat, lalu layar terangkat membuka hero |
| 2 | Hero Banner | ref-fleava | Slider 3 foto (Executive Search · For Companies · For Talent), Prev/Next, progress Lime, autoplay 6,5 dtk (berhenti saat tertutup); hero sticky, section berikutnya naik menutupinya |
| 3 | Every great team is a puzzle | index | Kalimat terisi kata demi kata; Master Piece (8%) menyatu di belakangnya |
| 4 | The Firm | ref-fleava | Foto duotone Jade dari bingkai inset ke layar penuh. Judul baru: "Built on research, run on speed." (judul ref sama dengan section 3) |
| 5 | Expertise | ref-fleava | Layanan sebagai satu baris tipografi; link ke section layanan. Tag industri dihapus (ada di section 7) |
| 6 | Our approach | index | Scroll horizontal 5 langkah |
| 7a | Industry coverage | gaya "How we hunt" | Latar Flash White; baris nomor + nama; hover/scroll mengubah susunan puzzle |
| 7b | For companies | gaya "How we hunt" | Latar Dark Slate; baris nomor · judul · deskripsi; kursor "View" |
| 8–11 | Consultants, News & insights, CTA, Footer | index | Tidak berubah |

QA: satu file tanpa request eksternal (4,2 MB); WCAG mobile 390/320 lolos (target ≥24 px, teks ≥12 px, tanpa scroll horizontal); reduced motion lengkap tanpa error.
