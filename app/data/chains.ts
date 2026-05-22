export interface ChainStep {
  attackId: string;
  phase: string;
  note: string;
}

export interface AttackChain {
  id: string;
  name: string;
  threat: string;
  severity: 'CRITICAL' | 'HIGH';
  color: string;
  desc: string;
  steps: ChainStep[];
}

export const CHAINS: AttackChain[] = [
  {
    id: 'ransomware-campaign',
    name: 'Kampanye Ransomware Korporat',
    threat: 'Ransomware Gang',
    severity: 'CRITICAL',
    color: '#ff2d55',
    desc: 'Kelompok kriminal terorganisir menyusup ke jaringan perusahaan melalui email phishing lalu menyebarkan ransomware setelah mencuri kredensial karyawan. Seluruh data dienkripsi dan tebusan diminta dalam bentuk kripto.',
    steps: [
      {
        attackId: 'phishing',
        phase: 'Initial Access',
        note: 'Email palsu mencuri kredensial karyawan melalui tautan login palsu',
      },
      {
        attackId: 'credential-stuffing',
        phase: 'Credential Access',
        note: 'Kredensial yang dicuri diuji ke berbagai layanan internal perusahaan',
      },
      {
        attackId: 'arp-spoofing',
        phase: 'Lateral Movement',
        note: 'ARP palsu mengalihkan traffic jaringan lokal untuk bergerak ke server lain',
      },
      {
        attackId: 'keylogger',
        phase: 'Collection',
        note: 'Keylogger dipasang untuk menangkap kata sandi administrator domain',
      },
      {
        attackId: 'ransomware',
        phase: 'Impact',
        note: 'Ransomware dieksekusi di seluruh jaringan mengenkripsi data bisnis kritis',
      },
    ],
  },
  {
    id: 'corporate-espionage',
    name: 'Spionase Korporat dari Dalam',
    threat: 'Insider Threat Actor',
    severity: 'HIGH',
    color: '#ff7b2c',
    desc: 'Aktor internal atau agen yang disusupi masuk secara fisik ke fasilitas perusahaan untuk menanamkan malware tingkat rendah yang mencuri data secara diam-diam. Serangan berlangsung berbulan-bulan tanpa terdeteksi.',
    steps: [
      {
        attackId: 'social-engineering',
        phase: 'Reconnaissance',
        note: 'Penyerang mempelajari rutinitas karyawan dan tata letak gedung target',
      },
      {
        attackId: 'tailgating',
        phase: 'Initial Access',
        note: 'Penyerang masuk gedung mengikuti karyawan tanpa badge sendiri',
      },
      {
        attackId: 'evil-maid',
        phase: 'Execution',
        note: 'Laptop yang ditinggalkan dimodifikasi fisik untuk menanamkan keylogger',
      },
      {
        attackId: 'rootkit',
        phase: 'Defense Evasion',
        note: 'Rootkit dipasang untuk menyembunyikan aktivitas malware dari antivirus',
      },
      {
        attackId: 'keylogger',
        phase: 'Collection',
        note: 'Semua penekanan tombol dikirim ke server eksternal secara berkala',
      },
    ],
  },
  {
    id: 'web-app-breach',
    name: 'Pembobolan Aplikasi Web Perusahaan',
    threat: 'Web Attacker',
    severity: 'HIGH',
    color: '#ffc83d',
    desc: 'Penyerang mengeksploitasi kerentanan berlapis pada aplikasi web publik mulai dari injeksi skrip hingga kueri database untuk akhirnya mencuri data pelanggan dari penyimpanan cloud yang salah dikonfigurasi.',
    steps: [
      {
        attackId: 'xss',
        phase: 'Initial Access',
        note: 'Skrip berbahaya disisipkan ke kolom komentar aplikasi web publik',
      },
      {
        attackId: 'csrf',
        phase: 'Execution',
        note: 'Token sesi pengguna dicuri lalu digunakan untuk aksi tidak sah',
      },
      {
        attackId: 'sqli',
        phase: 'Collection',
        note: 'Injeksi SQL mengekstrak tabel pengguna dan hash kata sandi dari database',
      },
      {
        attackId: 'cloud-misconfig',
        phase: 'Exfiltration',
        note: 'Bucket S3 publik yang salah konfigurasi memudahkan unduhan data massal',
      },
    ],
  },
  {
    id: 'supply-chain-apt',
    name: 'Serangan Rantai Pasok APT Tingkat Lanjut',
    threat: 'Nation-State APT',
    severity: 'CRITICAL',
    color: '#a78bfa',
    desc: 'Kelompok APT yang disponsori negara menyuntikkan kode berbahaya ke paket dependensi open source yang banyak digunakan sehingga ratusan organisasi terinfeksi secara bersamaan tanpa interaksi pengguna. Implant berjalan sepenuhnya di memori untuk menghindari deteksi.',
    steps: [
      {
        attackId: 'dependency-confusion',
        phase: 'Initial Access',
        note: 'Paket npm jahat diunggah menggantikan dependensi privat perusahaan target',
      },
      {
        attackId: 'fileless-malware',
        phase: 'Execution',
        note: 'Payload berjalan di memori PowerShell tanpa menyentuh disk sama sekali',
      },
      {
        attackId: 'ssrf',
        phase: 'Discovery',
        note: 'SSRF digunakan untuk mengakses endpoint metadata cloud dan mencuri token IAM',
      },
      {
        attackId: 'rootkit',
        phase: 'Defense Evasion',
        note: 'Rootkit kernel menyembunyikan proses dan koneksi jaringan dari tim SOC',
      },
    ],
  },
  {
    id: 'nation-state-apt',
    name: 'Operasi APT Negara terhadap Infrastruktur Kritis',
    threat: 'APT Group',
    severity: 'CRITICAL',
    color: '#4d94ff',
    desc: 'Kelompok APT negara-bangsa menargetkan infrastruktur kritis nasional dengan menggunakan zero-day browser untuk masuk melalui situs watering hole yang dikunjungi insinyur target. Operasi berlangsung dua tahun tanpa deteksi.',
    steps: [
      {
        attackId: 'watering-hole',
        phase: 'Initial Access',
        note: 'Situs industri yang sering dikunjungi target dikompromikan sebagai perangkap',
      },
      {
        attackId: 'zero-day',
        phase: 'Execution',
        note: 'Eksploitasi zero-day browser mengeksekusi shellcode tanpa klik pengguna',
      },
      {
        attackId: 'fileless-malware',
        phase: 'Defense Evasion',
        note: 'Malware hanya hidup di memori menggunakan WMI untuk persistensi tanpa file',
      },
      {
        attackId: 'rootkit',
        phase: 'Persistence',
        note: 'Rootkit tingkat kernel dipasang untuk akses permanen yang tidak terdeteksi',
      },
      {
        attackId: 'dns-spoofing',
        phase: 'Exfiltration',
        note: 'Data dieksfiltrasi melalui tunnel DNS terenkripsi ke server C2 luar negeri',
      },
    ],
  },
  {
    id: 'cloud-takeover',
    name: 'Pengambilalihan Akun Cloud Perusahaan',
    threat: 'Cloud Attacker',
    severity: 'CRITICAL',
    color: '#2dff8a',
    desc: 'Penyerang memulai dari email phishing terarah ke tim DevOps untuk mencuri token OAuth yang memberikan akses penuh ke lingkungan cloud. Data pelanggan ratusan ribu orang berhasil dicuri dalam satu malam.',
    steps: [
      {
        attackId: 'phishing',
        phase: 'Initial Access',
        note: 'Email phishing bertarget meniru notifikasi GitHub untuk menipu insinyur DevOps',
      },
      {
        attackId: 'credential-stuffing',
        phase: 'Credential Access',
        note: 'Kata sandi lama dari breach sebelumnya diuji ke akun cloud perusahaan',
      },
      {
        attackId: 'oauth-bypass',
        phase: 'Privilege Escalation',
        note: 'Alur OAuth dimanipulasi untuk mendapatkan token akses dengan scope penuh',
      },
      {
        attackId: 'cloud-misconfig',
        phase: 'Discovery',
        note: 'Bucket dan database yang salah konfigurasi ditemukan melalui pemindaian API',
      },
      {
        attackId: 'ssrf',
        phase: 'Exfiltration',
        note: 'SSRF dari fungsi Lambda digunakan mengunduh seluruh data dari storage internal',
      },
    ],
  },
];
