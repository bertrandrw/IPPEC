export interface Doctor {
  fullName: string;
  specialty: string;
}

export interface Hospital {
  name: string;
}

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  price: string;
  createdAt: string;
}

export interface PrescriptionMedicine {
  id: string;
  prescriptionId: string;
  medicineId: string;
  route: string;
  form: string;
  quantityPerDose: number;
  frequency: string;
  durationInDays: number;
  fullInstruction: string;
  totalQuantity: string;
  isDispensed: boolean;
  medicine: Medicine;
}

export interface Prescription {
  id: string;
  createdAt: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  chiefComplaints: string;
  findingsOnExam: string;
  investigations: string | null;
  advice: string;
  followUpDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'FULFILLED' | 'EXPIRED';
  dispensedById: string | null;
  dispensedAt: string | null;
  doctor: Doctor;
  hospital: Hospital;
  medicines: PrescriptionMedicine[];
}
