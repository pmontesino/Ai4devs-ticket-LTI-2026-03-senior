import { CandidateFormData } from './validation';

export type CandidateApiResponse = {
  id: string;
  message: string;
  cvUploaded: boolean;
};

export async function createCandidate(values: CandidateFormData, file?: File): Promise<CandidateApiResponse> {
  const formData = new FormData();
  formData.append('firstName', values.firstName);
  formData.append('lastName', values.lastName);
  formData.append('email', values.email);
  formData.append('phone', values.phone);
  formData.append('address', values.address);
  formData.append('education', values.education);
  formData.append('workExperience', values.workExperience);

  if (file) {
    formData.append('cv', file);
  }

  const response = await fetch('/api/candidates', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'No se pudo registrar el candidato.');
  }

  return data as CandidateApiResponse;
}
