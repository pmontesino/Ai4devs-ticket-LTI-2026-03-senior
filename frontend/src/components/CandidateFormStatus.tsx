import React from 'react';

type Props = {
  error: string;
  success: string;
};

export function CandidateFormStatus({ error, success }: Props) {
  return (
    <div aria-live="polite" className="status-panel">
      {error && <p className="status-error">{error}</p>}
      {success && <p className="status-ok">{success}</p>}
    </div>
  );
}
