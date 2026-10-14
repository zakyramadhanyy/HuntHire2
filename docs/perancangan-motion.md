# Perancangan Motion — HuntHire Homepage

Tanggal: 14 Oktober 2026
Pendekatan: **A. Lapisan motion di atas layout asli.** Struktur, tipografi, dan palet hunthire.id dipertahankan; pola motion Michael Page diterjemahkan ke identitas HuntHire (Jade, Lime, motif puzzle).

## 1. Fondasi

| Hal | Keputusan |
|---|---|
| Cakupan | Homepage saja (prototipe). Pola dipakai ulang untuk halaman lain setelah disetujui. |
| Stack | HTML/CSS/JS statis, bisa dibuka langsung (file://). Script klasik, bukan ES module. |
| Library | GSAP 3.13 + ScrollTrigger + SplitText, Lenis 1.1, Swiper 11 (CDN, versi dikunci). |
| Font | General Sans (judul), Cabinet Grotesk (body) dari Fontshare; fallback Inter. |
| Warna | Night #090F06, White #FDFFFE, Jade #29A869, Lime #C1FF04, Dark Slate #2B484E, Tiffany #A0D9CE, Tea Green #C6EBD4, Flash White #F0F0F0. Tersier hanya aksen kartu. |
| Skala | Fluid berbasis desain 1512px (`--u = 100vw / 1512`). |
| Easing | `--ease-out: cubic-bezier(0.11, 0.96, 0.33, 0.98)`; durasi 0.5 / 0.8 / 1.2 s. |
| Aset | Foto & teks hotlink dari hunthire.id; logo dibuat ulang sebagai SVG dari guideline. |

## 2. Koreografi per section

| # | Section | Motion asli HuntHire | Tambahan (terinspirasi Michael Page) |
|---|---|---|---|
| 0 | Preloader | Layar lime, counter 0–100 | 5 bentuk logo Puzzle terbang dari posisi acak lalu **menyusun diri** menjadi logo; layar terbuka dengan wipe ke atas (clip-path). Lenis berhenti selama preloader. |
| 1 | Hero | Judul per baris dengan mask | Bentuk puzzle melayang di sekitar judul dengan **parallax mengikuti kursor** (padanan partikel MP). Header turun setelah preloader. |
| 2 | Hero media | Foto lebar, parallax ringan | **Foto mengembang penuh layar** saat di-scroll (pinned + scrub, clip-path inset → 0); veil gelap masuk lalu muncul pernyataan brand "Speed · Expertise · Proven · Network" kata per kata. |
| 3 | Why partner | Paragraf abu → hitam (scrub) | Dipertahankan; tombol "Find out more" magnetic. |
| 4 | Kartu Why 1–3 | Kartu bertumpuk (sticky) | Kartu sebelumnya **mengecil & meredup** saat kartu berikut naik; foto di dalam kartu parallax; judul line-mask. |
| 5 | Industry Coverage | Daftar 2 kolom | **Latar berganti ke Tea Green**; marquee nama industri besar yang kecepatannya mengikuti kecepatan scroll; garis bawah item tergambar kiri→kanan; hover item bergeser + kotak Jade muncul. |
| 6 | Recruitment Service | Teks + 3 layanan | **Judul besar sticky ditimpa foto** yang naik dan membesar (pola MP); baris layanan muncul stagger, hover mengisi Jade dari bawah. |
| 7 | Consultants | Swiper | **Latar berganti ke Dark Slate**; kartu masuk stagger; kursor "Drag" lime di atas carousel; foto hover zoom; penanda "1 / 8". |
| 8 | News | 4 kartu | Latar kembali putih; kartu reveal clip dari bawah; hover foto scale + panah berputar. |
| 9 | CTA penutup (baru) | — | Latar lime; **potongan puzzle tersebar menyatu menjadi logo** seiring scroll (scrub) — makna "Makes the Perfect Connection" dari guideline. |
| 10 | Footer | Statis | Night + pola; tautan hover underline geser. |

Global: header sembunyi saat scroll turun / muncul saat scroll naik; progress bar Jade di atas; tombol WhatsApp lime mengambang; semua tombol pill magnetic.

## 3. Aksesibilitas & performa

- `prefers-reduced-motion: reduce` → tanpa Lenis, tanpa pin/scrub, konten langsung tampil, marquee berhenti.
- Mobile (< 768px): pin hero & kartu disederhanakan, parallax kursor dimatikan, marquee tetap.
- Hanya animasi `transform`, `opacity`, `clip-path`; gambar `loading="lazy"` kecuali hero.
- Preloader maks ±2.4 s dan punya fallback jika library gagal dimuat (konten tetap tampil).

## 4. Verifikasi

- Buka index.html di Chrome 1440px dan 390px; scroll seluruh halaman, cek tidak ada scroll horizontal, cek console bersih.
- Uji emulasi reduced-motion.
