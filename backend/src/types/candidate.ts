export type CandidatePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education?: string;
  workExperience?: string;
};

export type CandidateResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  education?: string;
  workExperience?: string;
  createdAt: Date;
  status: 'ACTIVE' | 'ANONYMIZED';
};

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details: string[];

  constructor(code: string, message: string, status = 400, details: string[] = []) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
