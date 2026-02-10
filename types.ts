
export enum LeaveType {
  ANNUAL = 'Annual',
  SICK = 'Sick',
  FAMILY = 'Family Responsibility',
  MATERNITY = 'Maternity',
  PARENTAL = 'Parental',
  UNPAID = 'Unpaid'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'PAYROLL' | 'HR' | 'SARS' | 'OTHER';
  notes?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  category: 'PAYROLL' | 'ENTITY' | 'WORKFORCE' | 'LEAVE' | 'SYSTEM' | 'DOCUMENTS' | 'TASKS' | 'MEETING';
  action: string;
  details: string;
  user: string;
}

export interface AppTask {
  id: string;
  title: string;
  notes: string;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  grade: string;
}

export interface AppDocument {
  id: string;
  title: string;
  category: 'CONTRACT' | 'IDENTIFICATION' | 'TAX' | 'POLICY' | 'OTHER';
  fileName: string;
  uploadDate: string;
  expiryDate?: string;
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  employeeId?: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  branchCode: string;
  accountType: 'Current' | 'Savings' | 'Business';
}

export interface Company {
  id: string;
  name: string;
  tradingName?: string;
  registrationNumber: string;
  payeNumber: string;
  uifNumber: string;
  sdlNumber?: string;
  vatNumber?: string;
  coidaNumber?: string;
  industry?: string;
  bbbeeLevel?: number;
  address: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  bankDetails?: BankDetails;
}

export type PayrollItemType = 'EARNING' | 'DEDUCTION' | 'FRINGE_BENEFIT' | 'REIMBURSEMENT';

export interface PayrollItem {
  id: string;
  code: string; // SARS Source Code
  description: string;
  amount: number;
  type: PayrollItemType;
  isTaxable: boolean;
  isFixed?: boolean; // Cannot be removed (like PAYE/UIF)
}

export interface Employee {
  id: string;
  companyId: string;
  role: 'ADMIN' | 'EMPLOYEE';
  status: 'ACTIVE' | 'TERMINATED';
  gender: 'Male' | 'Female' | 'Other';
  firstName: string;
  lastName: string;
  idNumber: string;
  taxNumber: string;
  email: string;
  phoneNumber: string;
  address: string;
  basicSalary: number;
  bankAccount: string;
  jobTitle: string; // Display title
  positionId?: string; // Linked to Position registry
  reportsToId?: string; // ID of the manager
  joinDate: string;
  
  // Termination details
  terminationDate?: string;
  terminationReason?: string;
  
  // Advanced Payroll Setup
  recurringItems: PayrollItem[];
  medicalAidDependents: number;
  
  // Next of Kin
  nokName: string;
  nokRelationship: string;
  nokContact: string;

  // ESS specifics
  leaveBalanceAnnual: number;
  leaveBalanceSick: number;
  leaveBalanceFamily: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason: string;
}
