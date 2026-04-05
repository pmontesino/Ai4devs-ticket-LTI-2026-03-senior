export type CandidateFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  workExperience: string;
};

const spainPhoneRegex = /^(\+34[6789]\d{8}|[6789]\d{8})$/;

export function validateCandidateForm(values: CandidateFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'El nombre es obligatorio.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'El apellido es obligatorio.';
  }

  if (!values.email.trim()) {
    errors.email = 'El correo electronico es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'El correo electronico no tiene un formato valido.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'El telefono es obligatorio.';
  } else if (!spainPhoneRegex.test(values.phone.trim())) {
    errors.phone = 'El telefono debe tener formato de Espana.';
  }

  return errors;
}
