import { AppError, CandidatePayload } from '../types/candidate';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPAIN_PHONE_REGEX = /^(\+34[6789]\d{8}|[6789]\d{8})$/;

export function validateCandidatePayload(payload: Partial<CandidatePayload>): CandidatePayload {
  const details: string[] = [];

  if (!payload.firstName?.trim()) {
    details.push('El nombre es obligatorio.');
  }

  if (!payload.lastName?.trim()) {
    details.push('El apellido es obligatorio.');
  }

  if (!payload.email?.trim()) {
    details.push('El correo electronico es obligatorio.');
  } else if (!EMAIL_REGEX.test(payload.email.trim())) {
    details.push('El correo electronico no tiene un formato valido.');
  }

  if (!payload.phone?.trim()) {
    details.push('El telefono es obligatorio.');
  } else if (!SPAIN_PHONE_REGEX.test(payload.phone.trim())) {
    details.push('El telefono debe tener formato de Espana (+34XXXXXXXXX o 9 digitos).');
  }

  if (details.length > 0) {
    throw new AppError('VALIDATION_ERROR', 'Existen errores de validacion.', 400, details);
  }

  return {
    firstName: payload.firstName!.trim(),
    lastName: payload.lastName!.trim(),
    email: payload.email!.trim().toLowerCase(),
    phone: payload.phone!.trim(),
    address: payload.address?.trim() || undefined,
    education: payload.education?.trim() || undefined,
    workExperience: payload.workExperience?.trim() || undefined,
  };
}

export const spainPhoneRegex = SPAIN_PHONE_REGEX;
