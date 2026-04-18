// Service Order types
export interface Part {
  id: string;
  name: string;
  value: number;
  quantity?: number;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  timestamp: number;
}

export interface ServiceOrder {
  id: string;
  osNumber: number;
  priority?: 'alta' | 'média' | 'baixa' | 'high' | 'medium' | 'low' | 'urgent';
  category?: 'elétrica' | 'refrigeração' | 'hidráulica' | 'mecânica' | 'outros';
  clientName: string;
  clientPhone?: string;
  clientAddress?: string;
  briefDescription: string;
  detailedDescription?: string;
  comments?: string;
  date?: string;
  time?: string;
  value: number;
  photos?: string[];
  parts?: Part[];
  status?: 'pending' | 'in_progress' | 'waiting_part' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Stock types
export interface StockMovement {
  id: string;
  partId: string;
  type: 'entrada' | 'saida';
  quantity: number;
  reason: string;
  osNumber?: number;
  timestamp: Date;
  notes?: string;
}

export interface PartStock {
  partId: string;
  currentStock: number;
  minimumStock: number;
  location?: string;
  barcode?: string;
  lastMovement?: Date;
}

// Parts catalog types
export interface PartCatalog {
  id: string;
  code: string;
  description: string;
  value: number;
  photo?: string;
  createdAt: Date;
  timesUsed?: number;
  lastUsedAt?: Date;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'technician' | 'manager';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
