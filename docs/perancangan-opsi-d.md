# Perancangan Opsi D — Gaya Fleava × Brand Guideline HuntHire

Tanggal: 15 Oktober 2026 · File: `opsi-d/index.html` (sumber: `opsi-d/index.src.html`)

Konsep: tata letak dan motion mengikuti bahasa visual fleava.com (section penuh layar, label kecil, teks sempit, baris tabel, gambar inset yang melebar). Warna, tipografi, logo, dan supergraphic mengikuti *HuntHire Brand Guidelines 2023*. Aset, kode, dan copy Fleava tidak dipakai.

## 1. Retouch sesuai guideline

| Aspek | Sebelumnya | Sekarang (acuan guideline) |
|---|---|---|
| Palet | Hitam custom, charcoal, hijau tua custom, krem | Hanya warna guideline: Night, White, Jade, Lime, Dark Slate, Flash White, Tiffany, Tea Green (hal. 16–18). Tersier tidak dipakai |
| Urutan warna section | Gelap hampir semua | Hero foto → **White** (intro) → **Jade** (The Firm) → **Night** → **Flash White** → **Dark Slate** → **Night** → **Dark Slate** → **Lime** (penutup, seperti slide "Thank you") → **Night** (footer) |
| Aksen | Abu & krem | Lime di latar gelap, Jade di latar terang (Lime = "hero colour") |
| Judul | General Sans 200–300 | General Sans **Medium 500** (Brand Typeface, hal. 22) |
| Teks | General Sans | **Cabinet Grotesk** (Secondary Type, hal. 23) |
| Logo | Wordmark 300/500, ikon berputar saat hover | Signature: Puzzle + Wordmark "**Hunt**" Bold / "Hire" Regular. Tidak diputar atau diubah proporsinya (Logo Do-nots, hal. 14) |
| Warna logo | Puzzle Jade di semua latar | Latar terang: Puzzle Jade + wordmark Night. Latar gelap: putih penuh. Latar Lime: Night penuh (Color implementation, hal. 20) |
| Ikon intro | Logo Puzzle berputar | Supergraphic **"Makes the Perfect Connection!"** (hal. 35): tile Jade/Lime/Tiffany/Tea/Slate/Night/Flash muncul berurutan, lubang bulatnya "klik" masuk |
| Loader | Ikon kecil di latar gelap | Halaman cover guideline: complete signature "Executive Recruitment Firm" di White + busur Jade di pojok, counter 0–100 |
| Label section | "/ Introduction" | Pola guideline "01 Overview": nomor (Jade/Lime) + nama section |
| Footer | Di dalam section hijau | Night + signature putih; baris bawah mengikuti footer guideline (wordmark · tengah · ©) |

## 2. Yang dipertahankan dari gaya Fleava

Hero slider (01 / 03, Prev / Next, progress bar Lime), hero sticky yang tertutup section berikutnya, teks yang meredup saat ditinggalkan, gambar inset yang melebar penuh, daftar layanan inline dengan nomor superscript, baris tabel "How we hunt" & "Featured Insights", daftar nama Hunters dengan foto mengikuti kursor, kursor titik → lingkaran Lime berlabel, menu layar penuh (Dark Slate).

## 3. Teknis

- Vanilla JS + Lenis 1.1.20. Memakai ulang `css/tokens.css` dan `js/data.js`.
- `prefers-reduced-motion`: tanpa loader, autoplay, reveal, dan parallax.
- Build: `python3 tools/build_embed.py opsi-d/index.src.html opsi-d/index.html`.

## 4. Copy baru (perlu persetujuan)

"Hiring the people who move a business forward.", "Executive search, built on evidence.", "Every great team is a puzzle.", "A shortlist in days, matched at 70% or more.", judul langkah "How we hunt", "The people behind every placement.", "Let's find the piece that fits.", serta paragraf pendampingnya.
