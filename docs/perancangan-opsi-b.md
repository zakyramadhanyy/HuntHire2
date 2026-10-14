# Perancangan Opsi B — "Puzzle Studio"

Tanggal: 14 Oktober 2026 · File: `opsi-b/index.html` (Opsi A tetap di `index.html`)

Konsep: logo Puzzle HuntHire (5 bentuk: kotak, lingkaran, bar, lingkaran, kotak) menjadi tokoh utama di setiap section. Sitemap disusun ulang berdasarkan audiens, mengikuti guideline yang memakai warna untuk memisahkan konten klien (Jade) dan talent (Lime).

## 1. Sitemap baru

| Grup | Halaman | Sumber di situs lama |
|---|---|---|
| **For Companies** | Our Services · Our Approach · Partner with us | /services, bagian Approach di /services, /contact |
| **For Talent** | Apply for Job · Events & Podcast | /apply, /event |
| **HuntHire** | Our Hunters · About us · Insights · Contact | /consultants, /about, /news, /contact |

Header: logo · **Hire talent** (Jade) · **Find a job** · Menu. Dua CTA audiens selalu terlihat.

## 2. Struktur homepage

| # | Section | Interaksi & motion |
|---|---|---|
| 0 | Intro | 5 potongan jatuh dan memantul ke posisinya, "klik" menyatu, wordmark terbuka; bar logo membanjiri layar lalu menyusut menjadi panel klien di hero |
| 1 | Hero terbelah | Kiri Jade "Hire the right team" (klien), kanan Lime "Find your perfect fit" (talent). Sisi yang di-hover melebar dan potongan logo condong ke arahnya. Logo mengikuti kursor. Saat di-scroll, kedua sisi terpisah, potongan logo berhamburan, dan muncul pernyataan "Every great team is a puzzle…" yang terisi per kata |
| 2 | Puzzle game | Pengunjung **menyeret 5 potongan** ke outline logo. Tiap potongan = satu nilai (Research, STAR, Network, Speed, Care) dan panel info berganti. Selesai → kilau Jade/Lime, ledakan konfeti bentuk, "Perfect fit." Ada tombol "Solve it for me" + Reset; bisa juga dengan keyboard |
| 3 | Approach | Scroll horizontal (pinned) 5 langkah; bentuk logo berputar & membesar per langkah; indikator logo kecil terisi potongan demi potongan |
| 4 | Angka | 2018 · 6 negara · 10 industri · 70%+ match; counter naik, bentuk latar berubah wujud saat hover |
| 5 | Industries | Hover nama industri → 5 potongan logo **menyusun gambar baru** (rak FMCG, menara Telco, salib Health, dst.) lalu kembali menjadi logo |
| 6 | Services | Accordion; mask foto berubah bentuk sesuai layanan (kotak → lingkaran → setengah pil → daun) |
| 7 | Hunters | 8 konsultan dalam mask kotak/lingkaran yang "pop" masuk; hover menukar bentuk mask |
| 8 | Insights | Baris artikel; preview foto mengikuti kursor dan miring sesuai kecepatan gerak |
| 9 | CTA | Medan ratusan kotak & lingkaran yang membesar dan berputar di sekitar kursor (mobile: gelombang otomatis) |
| 10 | Footer | Potongan logo jatuh & memantul, bisa diseret dan dilempar; huruf wordmark raksasa melompat saat di-hover |

Global: kursor custom berbentuk potongan (lingkaran → kotak → pil "Drag"), logo header berhamburan saat hover, menu layar penuh dengan wipe 5 panel berwarna, tombol magnetic, smooth scroll Lenis.

## 3. Teknis

- GSAP 3.13 (ScrollTrigger, SplitText, Draggable) + Lenis, via CDN dengan versi dikunci.
- Memakai ulang `css/tokens.css` dan `js/data.js` dari Opsi A.
- `prefers-reduced-motion`: tanpa intro, pin, dan scrub; game, accordion, dan menu tetap berfungsi.

## 4. Copy baru (perlu persetujuan)

Teks berikut ditulis untuk Opsi B dan tidak ada di situs asli: "Hire the right team" / "Find your perfect fit" beserta deskripsinya, "Every great team is a puzzle. We find the piece that fits." (diturunkan dari guideline hal. 34), "Five pieces. One perfect fit.", judul 5 langkah Approach (diturunkan dari teks Why), "Services built around your hire.", "The hunters behind every hire.", "Let's complete your team.", serta deskripsi singkat Coaching.
