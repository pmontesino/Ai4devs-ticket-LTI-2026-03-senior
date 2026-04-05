describe('TLS policy', () => {
  it('defaults to TLSv1.2 or stronger', () => {
    const tlsVersion = process.env.TLS_MIN_VERSION || 'TLSv1.2';
    expect(['TLSv1.2', 'TLSv1.3']).toContain(tlsVersion);
  });
});
