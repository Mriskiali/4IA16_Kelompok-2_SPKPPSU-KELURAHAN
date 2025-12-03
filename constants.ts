import { Report, ReportCategory, ReportStatus, Role, User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    pjlpNumber: '50422231',
    name: 'Annas Rizky',
    role: Role.PETUGAS,
    isActive: true,
    phone: '081234567890',
    avatarUrl: 'https://picsum.photos/200',
    password: 'password123'
  },
  {
    id: 'u2',
    pjlpNumber: '50422232',
    name: 'Annaufal Arifa',
    role: Role.PETUGAS,
    isActive: true,
    phone: '081234567891',
    avatarUrl: 'https://picsum.photos/201',
    password: 'password123'
  },
  {
    id: 'a1',
    pjlpNumber: 'admin',
    name: 'Admin Kelurahan',
    role: Role.ADMIN,
    isActive: true,
    avatarUrl: 'https://picsum.photos/202',
    password: 'admin'
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Annas Rizky',
    category: ReportCategory.KEBERSIHAN,
    description: 'Pembersihan sampah liar di Jl. Pemuda No. 10',
    location: 'Jl. Pemuda No. 10, Rawamangun',
    imageUrl: 'https://picsum.photos/800/600',
    status: ReportStatus.PENDING,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Annaufal Arifa',
    category: ReportCategory.KERUSAKAN,
    description: 'Trotoar amblas sedalam 10cm',
    location: 'Jl. Balai Pustaka Timur',
    imageUrl: 'https://picsum.photos/800/601',
    status: ReportStatus.ACCEPTED,
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: 'r3',
    userId: 'u1',
    userName: 'Annas Rizky',
    category: ReportCategory.SALURAN,
    description: 'Pembersihan got mampet karena lumpur',
    location: 'RT 04 / RW 02',
    imageUrl: 'https://picsum.photos/800/602',
    status: ReportStatus.REJECTED,
    feedback: 'Foto kurang jelas, tolong ambil ulang',
    createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  }
];

export const CATEGORY_COLORS = {
  [ReportCategory.KEBERSIHAN]: 'bg-green-100 text-green-800',
  [ReportCategory.KERUSAKAN]: 'bg-red-100 text-red-800',
  [ReportCategory.TAMAN]: 'bg-green-100 text-green-800',
  [ReportCategory.SALURAN]: 'bg-blue-100 text-blue-800',
  [ReportCategory.LAINNYA]: 'bg-gray-100 text-gray-800',
};

export const STATUS_COLORS = {
  [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ReportStatus.ACCEPTED]: 'bg-green-100 text-green-800',
  [ReportStatus.REJECTED]: 'bg-red-100 text-red-800',
};