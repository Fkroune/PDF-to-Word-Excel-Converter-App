export type ConversionFormat = 'docx' | 'xlsx';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: 'user' | 'admin';
}

export interface FileRecord {
  id: string;
  originalName: string;
  originalType: string;
  convertedFormat: ConversionFormat;
  createdAt: number;
  downloadUrl?: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}