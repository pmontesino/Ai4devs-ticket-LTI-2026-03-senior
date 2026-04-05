import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CandidateForm } from '../components/CandidateForm';

describe('CandidateForm', () => {
  it('shows validation message when required fields are empty', async () => {
    render(<CandidateForm />);

    fireEvent.click(screen.getByRole('button', { name: /guardar candidato/i }));

    expect(await screen.findByText(/corrige los errores del formulario/i)).toBeInTheDocument();
  });

  it('enables submit flow after correcting invalid phone', async () => {
    render(<CandidateForm />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/correo electronico/i), { target: { value: 'ana.perez@example.com' } });
    fireEvent.change(screen.getByLabelText(/telefono \(espana\)/i), { target: { value: '12345' } });

    const submitButton = screen.getByRole('button', { name: /guardar candidato/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/corrige los errores del formulario/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/telefono \(espana\)/i), { target: { value: '612345678' } });
    expect(submitButton).not.toBeDisabled();
  });
});
