import request from 'supertest';
import { app } from '../index';
import { encryptField } from '../utils/field-encryption';

describe('Candidates API', () => {
  it('validates required fields in candidate create', async () => {
    const response = await request(app).post('/api/candidates').field('firstName', '');
    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('rejects wrong Spain phone format', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .field('firstName', 'Ana')
      .field('lastName', 'Diaz')
      .field('email', `ana_${Date.now()}@example.com`)
      .field('phone', '12345');

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('does not store encrypted field as plain text', () => {
    const encrypted = encryptField('600123123');
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toContain('600123123');
  });
});
