import React from 'react';
import { CandidateFormData } from '../services/validation';

type Props = {
  values: CandidateFormData;
  errors: Record<string, string>;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function CandidateFormFields({ values, errors, onChange }: Props) {
  return (
    <>
      <label htmlFor="firstName">Nombre *</label>
      <input id="firstName" name="firstName" value={values.firstName} onChange={onChange} aria-invalid={Boolean(errors.firstName)} />
      {errors.firstName && <span className="field-error">{errors.firstName}</span>}

      <label htmlFor="lastName">Apellido *</label>
      <input id="lastName" name="lastName" value={values.lastName} onChange={onChange} aria-invalid={Boolean(errors.lastName)} />
      {errors.lastName && <span className="field-error">{errors.lastName}</span>}

      <label htmlFor="email">Correo electronico *</label>
      <input id="email" name="email" value={values.email} onChange={onChange} aria-invalid={Boolean(errors.email)} />
      {errors.email && <span className="field-error">{errors.email}</span>}

      <label htmlFor="phone">Telefono (Espana) *</label>
      <input id="phone" name="phone" value={values.phone} onChange={onChange} aria-invalid={Boolean(errors.phone)} />
      {errors.phone && <span className="field-error">{errors.phone}</span>}

      <label htmlFor="address">Direccion</label>
      <input id="address" name="address" value={values.address} onChange={onChange} />

      <label htmlFor="education">Educacion</label>
      <textarea id="education" name="education" value={values.education} onChange={onChange} />

      <label htmlFor="workExperience">Experiencia laboral</label>
      <textarea id="workExperience" name="workExperience" value={values.workExperience} onChange={onChange} />
    </>
  );
}
