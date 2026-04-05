import React, { useState } from 'react';
import { createCandidate } from '../services/candidateApi';
import { CandidateFormData, validateCandidateForm } from '../services/validation';
import { CandidateFormFields } from './CandidateFormFields';
import { CandidateFormStatus } from './CandidateFormStatus';

const initialState: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  education: '',
  workExperience: '',
};

export function CandidateForm() {
  const [values, setValues] = useState<CandidateFormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => {
      const nextValues = { ...prev, [name]: value };
      setErrors(validateCandidateForm(nextValues));
      return nextValues;
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateCandidateForm(values);
    setErrors(validationErrors);
    setErrorMessage('');
    setSuccessMessage('');

    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage('Corrige los errores del formulario antes de continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createCandidate(values, selectedFile);
      setSuccessMessage(response.message);
      setValues(initialState);
      setErrors({});
      setSelectedFile(undefined);
    } catch (error) {
      setErrorMessage((error as Error).message || 'No se pudo registrar el candidato.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="candidate-card">
      <h1>Anadir candidato</h1>
      <p className="candidate-subtitle">Registra perfiles para el proceso de seleccion ATS.</p>

      <form onSubmit={onSubmit} className="candidate-form">
        <CandidateFormFields values={values} errors={errors} onChange={onChange} />

        <label htmlFor="cv">CV (opcional, PDF o DOCX, max 10 MB)</label>
        <input id="cv" name="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileChange} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar candidato'}
        </button>
      </form>

      <CandidateFormStatus error={errorMessage} success={successMessage} />
    </section>
  );
}
