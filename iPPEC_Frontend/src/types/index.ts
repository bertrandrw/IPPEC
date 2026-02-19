export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacist' | 'admin' | 'insurer';
  avatar?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string; // For doctors and pharmacists
  specialization?: string; // For doctors
  pharmacyId?: string; // For pharmacists
  insuranceInfo?: InsuranceInfo;
  createdAt: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validUntil: string;
}

export interface AuthContextType {
  user: User | null;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  specialization?: string;
  dateOfBirth?: string;
  sex?: string;
  nid?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
  issuedDate: string;
  validUntil: string;
  status: 'active' | 'expired' | 'fulfilled' | 'cancelled';
  digitalSignature: string;
  qrCode: string;
  allowedPharmacies: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  refills: number;
  requiresPrescription: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  price: number;
  stock: number;
  expiryDate: string;
  requiresPrescription: boolean;
  description: string;
  sideEffects: string[];
  contraindications: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  workingHours: string;
  services: string[];
  rating: number;
  isVerified: boolean;
}

export interface Order {
  id: string;
  patientId: string;
  pharmacyId: string;
  prescriptionId: string;
  medications: OrderMedication[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  paymentMethod: 'cash' | 'card' | 'insurance' | 'online';
  insuranceClaimId?: string;
}

export interface OrderMedication {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
  available: boolean;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  pharmacyId: string;
  orderId: string;
  prescriptionId: string;
  insuranceProvider: string;
  claimAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  processedDate?: string;
  rejectionReason?: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  publishedDate: string;
  imageUrl?: string;
  readTime: number;
  isPublished: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'prescription' | 'order' | 'insurance';
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalPrescriptions?: number;
  activePrescriptions?: number;
  totalOrders?: number;
  pendingOrders?: number;
  totalPatients?: number;
  totalRevenue?: number;
  insuranceClaims?: number;
  articlesPublished?: number;
}

export interface PrivateOrder {
  id: string;
  patientId: string;
  items: PrivateOrderItem[];
  deliveryAddress: DeliveryAddress;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  discreteDelivery: boolean;
  orderType: 'private';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface PrivateOrderItem {
  id: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  medicine: PrivateMedicine;
}

export interface PrivateMedicine {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  discretePackaging: boolean;
  requiresAgeVerification: boolean;
  image?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryInstructions: string;
  discreteDelivery: boolean;
}