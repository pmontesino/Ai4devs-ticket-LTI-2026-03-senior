# Backend Security Notes

## TLS policy

Production endpoints must negotiate TLS version 1.2 or higher.

## Verification

- Check runtime TLS setting from environment variable `TLS_MIN_VERSION`.
- Reject insecure configurations below TLS 1.2 in deployment pipeline.
