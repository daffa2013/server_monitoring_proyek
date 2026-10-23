import { StudentProject, ServerNode, NotificationItem } from '../types';

export const INITIAL_SERVER_NODES: ServerNode[] = [
  {
    id: 'node-web-7a',
    name: 'Node Alpha · Web Server Kelas 7A',
    role: 'Frontend & UI Hosting',
    ipAddress: '192.168.10.14',
    status: 'nominal',
    uptimeSeconds: 86420,
    cpuPercent: 24,
    ramUsageMB: 1840,
    ramTotalMB: 4096,
    diskUsageGB: 18.4,
    diskTotalGB: 64,
    networkInKBps: 340,
    networkOutKBps: 580,
    latencyMs: 18,
    activeConnections: 42,
    temperatureC: 41
  },
  {
    id: 'node-db-7',
    name: 'Node Beta · Database Proyek Siswa',
    role: 'Database Relasional & JSON Store',
    ipAddress: '192.168.10.18',
    status: 'nominal',
    uptimeSeconds: 124800,
    cpuPercent: 38,
    ramUsageMB: 2890,
    ramTotalMB: 4096,
    diskUsageGB: 34.2,
    diskTotalGB: 128,
    networkInKBps: 820,
    networkOutKBps: 910,
    latencyMs: 24,
    activeConnections: 68,
    temperatureC: 45
  },
  {
    id: 'node-api-7b',
    name: 'Node Gamma · API & Bot Gateway',
    role: 'Microservices & API Server',
    ipAddress: '192.168.10.22',
    status: 'nominal',
    uptimeSeconds: 43200,
    cpuPercent: 19,
    ramUsageMB: 1420,
    ramTotalMB: 4096,
    diskUsageGB: 12.1,
    diskTotalGB: 64,
    networkInKBps: 210,
    networkOutKBps: 310,
    latencyMs: 15,
    activeConnections: 29,
    temperatureC: 39
  },
  {
    id: 'node-cdn-7c',
    name: 'Node Delta · File & Media Storage Mading',
    role: 'Asset Cache & File Server',
    ipAddress: '192.168.10.26',
    status: 'nominal',
    uptimeSeconds: 98400,
    cpuPercent: 14,
    ramUsageMB: 980,
    ramTotalMB: 4096,
    diskUsageGB: 48.6,
    diskTotalGB: 128,
    networkInKBps: 450,
    networkOutKBps: 1120,
    latencyMs: 12,
    activeConnections: 54,
    temperatureC: 38
  }
];

export const INITIAL_STUDENT_PROJECTS: StudentProject[] = [
  {
    id: 'proj-01',
    title: 'Portal Mading Digital Kreatif 7A',
    classGroup: 'Kelas 7A',
    category: 'Aplikasi Web',
    teamMembers: ['Fajar Pratama (Ketua)', 'Siti Nurhaliza', 'Rayhan Ardiansyah', 'Adinda Putri'],
    leadStudent: 'Fajar Pratama',
    mentorTeacher: 'Pak Hendra, S.Kom',
    description: 'Portal majalah dinding digital interaktif yang memuat karya cerpen, puisi, dokumentasi ekstrakurikuler, dan prestasi mingguan kelas 7.',
    serverNodeId: 'node-web-7a',
    currentProgress: 80,
    createdAt: '2026-10-05',
    lastUpdated: '2026-10-22',
    milestonesUnlocked: [25, 50, 75],
    tasks: [
      {
        id: 't-01-1',
        title: 'Tahap 1 · Riset Ide & Struktur Konten Mading',
        description: 'Menyusun daftar rubrik mading (opini, karya seni, jadwal kelas) dan sketsa wireframe di kertas.',
        weight: 20,
        completed: true,
        completedAt: '2026-10-08',
        submittedBy: 'Fajar Pratama',
        notes: 'Semua rubrik mading disepakati tim dan wali kelas.',
        submissionLink: 'https://drive.google.com/contoh-sketsa-mading'
      },
      {
        id: 't-01-2',
        title: 'Tahap 2 · Desain Visual & Layout Antarmuka',
        description: 'Membuat halaman depan yang responsif dengan warna ceria dan tombol navigasi yang mudah bagi siswa.',
        weight: 25,
        completed: true,
        completedAt: '2026-10-14',
        submittedBy: 'Siti Nurhaliza',
        notes: 'Desain responsif dicoba di ponsel dan laptop kelas.',
        submissionLink: 'https://figma.com/contoh-desain-7a'
      },
      {
        id: 't-01-3',
        title: 'Tahap 3 · Integrasi API Konten & Unggah Artikel',
        description: 'Membuat form tambah tulisan karya siswa yang langsung tersimpan ke server database sekolah.',
        weight: 35,
        completed: true,
        completedAt: '2026-10-21',
        submittedBy: 'Rayhan Ardiansyah',
        notes: 'Endpoint POST /api/mading dan upload gambar sudah berjalan lancar.',
        submissionLink: 'https://github.com/contoh-mading-7a'
      },
      {
        id: 't-01-4',
        title: 'Tahap 4 · Uji Coba Server & Rilis Presentasi Akhir',
        description: 'Mengukur waktu muat server saat diakses serentak oleh 30 siswa di kelas dan menyiapkan laporan akhir.',
        weight: 20,
        completed: false,
        notes: 'Tinggal demonstrasi di depan kelas dan uji beban server.'
      }
    ]
  },
  {
    id: 'proj-02',
    title: 'Game Kuis Edukasi Sejarah & Budaya Nusantara',
    classGroup: 'Kelas 7B',
    category: 'Game Edukasi',
    teamMembers: ['Nabila Azzahra (Ketua)', 'Dimas Saputra', 'Kenzo Pratama'],
    leadStudent: 'Nabila Azzahra',
    mentorTeacher: 'Ibu Ratna Dewi, M.Pd',
    description: 'Game tebak pahlawan dan rumah adat 34 provinsi dengan sistem timer, perolehan skor real-time, dan leaderboard server.',
    serverNodeId: 'node-api-7b',
    currentProgress: 100,
    createdAt: '2026-09-28',
    lastUpdated: '2026-10-20',
    milestonesUnlocked: [25, 50, 75, 100],
    tasks: [
      {
        id: 't-02-1',
        title: 'Tahap 1 · Kurasi 50 Soal Sejarah & Aturan Game',
        description: 'Menulis soal kuis validasi bersama guru IPS dan menentukan formula skor.',
        weight: 20,
        completed: true,
        completedAt: '2026-10-02',
        submittedBy: 'Nabila Azzahra',
        notes: '50 soal sudah diverifikasi oleh Ibu Ratna.',
        submissionLink: 'https://docs.google.com/contoh-soal-ips'
      },
      {
        id: 't-02-2',
        title: 'Tahap 2 · Desain Papan Kuis & Efek Suara Interaktif',
        description: 'Merancang tampilan kuis berbasis kartu dan efek animasi skor bertambah.',
        weight: 25,
        completed: true,
        completedAt: '2026-10-09',
        submittedBy: 'Kenzo Pratama',
        notes: 'Aset grafis bebas royalti dan suara sintetis selesai.',
        submissionLink: 'https://github.com/contoh-game-ui'
      },
      {
        id: 't-02-3',
        title: 'Tahap 3 · Koding Logika Skor & Leaderboard Server',
        description: 'Mengirim skor tertinggi setiap pemain ke API server database dan menampilkan peringkat kelas.',
        weight: 35,
        completed: true,
        completedAt: '2026-10-16',
        submittedBy: 'Dimas Saputra',
        notes: 'Penyimpanan ranking otomatis menggunakan JSON database.',
        submissionLink: 'https://github.com/contoh-kuis-api'
      },
      {
        id: 't-02-4',
        title: 'Tahap 4 · Uji Coba Turnamen Kelas & Dokumentasi Lengkap',
        description: 'Menjalankan turnamen mini saat jam istirahat untuk 25 siswa dan menyusun laporan evaluasi.',
        weight: 20,
        completed: true,
        completedAt: '2026-10-20',
        submittedBy: 'Nabila Azzahra',
        notes: 'Game sukses dimainkan 25 siswa secara serentak tanpa lag server!',
        submissionLink: 'https://drive.google.com/contoh-laporan-turnamen'
      }
    ]
  },
  {
    id: 'proj-03',
    title: 'Bot Pengingat Tugas PR & Jadwal Piket Harian',
    classGroup: 'Kelas 7A',
    category: 'Bot & Otomasi',
    teamMembers: ['Alya Safitri (Ketua)', 'Zahra Amelia', 'Budi Santoso'],
    leadStudent: 'Alya Safitri',
    mentorTeacher: 'Pak Hendra, S.Kom',
    description: 'Sistem pengingat otomatis jadwal piket kebersihan kelas dan batas pengumpulan PR mata pelajaran setiap pukul 16.00 WIB.',
    serverNodeId: 'node-api-7b',
    currentProgress: 55,
    createdAt: '2026-10-10',
    lastUpdated: '2026-10-22',
    milestonesUnlocked: [25, 50],
    tasks: [
      {
        id: 't-03-1',
        title: 'Tahap 1 · Pendataan Jadwal Guru & Rotasi Piket',
        description: 'Mengumpulkan roster pelajaran semester ganjil dan nama 32 siswa kelompok piket.',
        weight: 20,
        completed: true,
        completedAt: '2026-10-12',
        submittedBy: 'Alya Safitri',
        notes: 'Data jadwal sudah sinkron dengan kalender akademik kelas.'
      },
      {
        id: 't-03-2',
        title: 'Tahap 2 · Desain Template Pesan & Format Notifikasi',
        description: 'Membuat format pesan ramah anak dengan emoji teratur dan penanda tingkat urgensi tugas.',
        weight: 25,
        completed: true,
        completedAt: '2026-10-18',
        submittedBy: 'Zahra Amelia',
        notes: 'Template pesan sudah rapi dan mudah dibaca di layar HP.'
      },
      {
        id: 't-03-3',
        title: 'Tahap 3 · Cron Job Server & Pengiriman Terjadwal',
        description: 'Memasang timer di node server agar otomatis memeriksa database tugas setiap 1 jam.',
        weight: 35,
        completed: false,
        notes: 'Sedang mengatur interval trigger pengiriman pesan.'
      },
      {
        id: 't-03-4',
        title: 'Tahap 4 · Pengujian Akurasi Pengingat & Presentasi',
        description: 'Evaluasi selama 5 hari sekolah untuk memastikan tidak ada tugas yang terlewat dikabarkan.',
        weight: 20,
        completed: false
      }
    ]
  },
  {
    id: 'proj-04',
    title: 'Katalog Perpustakaan & Mini Scanner Barcode Buku',
    classGroup: 'Kelas 7C',
    category: 'Sistem Sekolah',
    teamMembers: ['Tiara Kusuma (Ketua)', 'Farhan Maulana', 'Anisa Rahmawati', 'Rendra Bagus'],
    leadStudent: 'Tiara Kusuma',
    mentorTeacher: 'Ibu Ratna Dewi, M.Pd',
    description: 'Aplikasi pencarian koleksi buku fiksi dan pelajaran di perpustakaan sekolah dengan fitur scan barcode kamera ponsel.',
    serverNodeId: 'node-db-7',
    currentProgress: 45,
    createdAt: '2026-10-12',
    lastUpdated: '2026-10-21',
    milestonesUnlocked: [25],
    tasks: [
      {
        id: 't-04-1',
        title: 'Tahap 1 · Inventarisasi 100 Judul Buku Populer',
        description: 'Mencatat ISBN, judul buku, pengarang, dan nomor rak lemari perpustakaan sekolah.',
        weight: 20,
        completed: true,
        completedAt: '2026-10-15',
        submittedBy: 'Tiara Kusuma',
        notes: '120 buku berhasil diinput ke format data terstruktur.'
      },
      {
        id: 't-04-2',
        title: 'Tahap 2 · Tampilan Pencarian Cepat & Filter Genre',
        description: 'Membuat kotak pencarian cerdas dengan filter kategori sains, sastra, dan ensiklopedia.',
        weight: 25,
        completed: true,
        completedAt: '2026-10-21',
        submittedBy: 'Farhan Maulana',
        notes: 'Fitur filter genre sudah berjalan interaktif.'
      },
      {
        id: 't-04-3',
        title: 'Tahap 3 · Integrasi Scanner Kamera & Database Server',
        description: 'Menghubungkan detektor barcode kamera ke database server perpustakaan untuk mengecek stok buku.',
        weight: 35,
        completed: false,
        notes: 'Sedang menguji modul pembaca barcode dengan webcam kelas.'
      },
      {
        id: 't-04-4',
        title: 'Tahap 4 · Uji Coba Peminjaman Mandiri & Laporan',
        description: 'Simulasi proses peminjaman 10 buku oleh siswa kelas 7C dan verifikasi pencatatan tanggal kembali.',
        weight: 20,
        completed: false
      }
    ]
  },
  {
    id: 'proj-05',
    title: 'Sensor Monitor Kualitas Udara & Suhu Lab Komputer',
    classGroup: 'Kelas 7B',
    category: 'IoT & Hardware',
    teamMembers: ['Eko Wahyudi (Ketua)', 'Tasya Amelia', 'Rifqi Pratama'],
    leadStudent: 'Eko Wahyudi',
    mentorTeacher: 'Pak Hendra, S.Kom',
    description: 'Perangkat mikrokontroler pengukur suhu dan kelembaban ruang server lab komputer yang mengirim telemetri tiap 30 detik.',
    serverNodeId: 'node-web-7a',
    currentProgress: 20,
    createdAt: '2026-10-16',
    lastUpdated: '2026-10-22',
    milestonesUnlocked: [],
    tasks: [
      {
        id: 't-05-1',
        title: 'Tahap 1 · Perakitan Rangkaian Sensor & Breadboard',
        description: 'Menghubungkan sensor DHT22 ke mikrokontroler dan menyambungkan ke jaringan WiFi sekolah.',
        weight: 20,
        completed: true,
        completedAt: '2026-10-19',
        submittedBy: 'Eko Wahyudi',
        notes: 'Kabel sensor terpasang rapi dan indikator daya menyala normal.'
      },
      {
        id: 't-05-2',
        title: 'Tahap 2 · Pembuatan Dasbor Grafik Suhu Real-Time',
        description: 'Merancang visual termometer digital dan grafik perubahan suhu ruangan lab komputer.',
        weight: 25,
        completed: false,
        notes: 'Sedang merancang tampilan speedometer suhu.'
      },
      {
        id: 't-05-3',
        title: 'Tahap 3 · Endpoint Pengiriman Data Telemetri HTTP',
        description: 'Menulis script transmisi data suhu dari sensor ke node server pemantau.',
        weight: 35,
        completed: false
      },
      {
        id: 't-05-4',
        title: 'Tahap 4 · Pengujian Kalibrasi 24 Jam & Dokumentasi',
        description: 'Mencatat kestabilan suhu ruangan selama pendingin AC lab beroperasi penuh.',
        weight: 20,
        completed: false
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    timestamp: 'Baru saja',
    title: '🏆 Selamat! Pencapaian 100% Sempurna!',
    message: 'Tim Game Kuis Sejarah Nusantara (Kelas 7B) telah menyelesaikan semua tahapan proyek dan mencapai target 100 Poin Penuh!',
    type: 'milestone_100',
    projectId: 'proj-02',
    projectTitle: 'Game Kuis Edukasi Sejarah & Budaya Nusantara',
    read: false
  },
  {
    id: 'notif-02',
    timestamp: '2 jam lalu',
    title: '⚡ Target 75% Tercapai: Ahli Sistem!',
    message: 'Tim Portal Mading Digital Kreatif 7A berhasil menuntaskan Tahap 3 dan kini berada di 80% progres.',
    type: 'milestone_75',
    projectId: 'proj-01',
    projectTitle: 'Portal Mading Digital Kreatif 7A',
    read: false
  },
  {
    id: 'notif-03',
    timestamp: 'Kemarin',
    title: '🎯 Target 50% Tercapai: Penjelajah Kode!',
    message: 'Tim Bot Pengingat Tugas PR & Jadwal Piket (Kelas 7A) mencapai 55% progres proyek.',
    type: 'milestone_50',
    projectId: 'proj-03',
    projectTitle: 'Bot Pengingat Tugas PR & Jadwal Piket Harian',
    read: true
  },
  {
    id: 'notif-04',
    timestamp: '3 hari lalu',
    title: '🚀 Milestone Pertama 25% Terbuka: Arsitek Muda!',
    message: 'Tim Katalog Perpustakaan Kelas 7C membuka lencana pertama setelah menyelesaikan inventarisasi 100 buku.',
    type: 'milestone_25',
    projectId: 'proj-04',
    projectTitle: 'Katalog Perpustakaan & Mini Scanner Barcode Buku',
    read: true
  }
];

export const EDUCATIONAL_CONCEPTS = [
  {
    id: 'cpu',
    term: 'CPU (Processor Server)',
    analogy: 'Otak Cepat Sang Koki',
    icon: 'Cpu',
    description: 'CPU bertugas menghitung dan menjalankan perintah setiap saat siswa membuka halaman web atau mengirim jawaban kuis.',
    idealState: 'Penggunaan 10% - 60% tergolong sehat. Jika di atas 85%, server mungkin butuh jeda atau optimasi kode!'
  },
  {
    id: 'ram',
    term: 'RAM (Memori Kerja)',
    analogy: 'Meja Belajar Tempat Menaruh Buku',
    icon: 'Database',
    description: 'RAM menyimpan data sementara yang sedang aktif digunakan agar server tidak perlu terus-menerus mencari ke hard disk yang lebih lambat.',
    idealState: 'Semakin banyak siswa yang login bersamaan, semakin banyak RAM yang terisi. Jangan sampai melebihi 90%!'
  },
  {
    id: 'latency',
    term: 'Latensi (Ping / Response Time)',
    analogy: 'Kecepatan Kurir Surat',
    icon: 'Zap',
    description: 'Waktu yang dibutuhkan dari saat kamu menekan tombol klik sampai server menjawab kembali ke layar monitormu.',
    idealState: 'Di bawah 50 milidetik (ms) sangat cepat! Jika di atas 200ms, aplikasi akan terasa lemot.'
  },
  {
    id: 'bandwidth',
    term: 'Throughput Jaringan (Bandwidth)',
    analogy: 'Lebar Pipa Aliran Air',
    icon: 'Activity',
    description: 'Berapa banyak data (gambar mading, suara kuis, teks) yang bisa dialirkan masuk dan keluar server dalam satu detik.',
    idealState: 'Diukur dalam KB/s atau MB/s. Gambar yang sudah dikompresi membuat server lebih hemat kuota.'
  },
  {
    id: 'storage',
    term: 'Disk Storage (Penyimpanan)',
    analogy: 'Lemari Arsip Arsiparis',
    icon: 'HardDrive',
    description: 'Tempat menyimpan file artikel, foto karya siswa, dan script kode secara permanen meski server dimatikan.',
    idealState: 'Perlu dicek secara berkala agar tidak penuh oleh file foto berukuran terlalu besar.'
  }
];
