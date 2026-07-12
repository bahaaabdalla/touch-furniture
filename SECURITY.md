# Security measures

- Every public table has RLS enabled. Anonymous access is read-only and limited to rows whose full parent chain is published.
- Write policies require an authenticated, non-anonymous JWT with `app_metadata.role = admin`.
- Admin routes use Proxy only as an early redirect; layouts and every Server Action verify claims again, while RLS remains authoritative.
- The browser receives only the Supabase publishable key. The secret key is reserved for local provisioning/seed operations.
- Raw uploads are private, user-prefixed, MIME/size restricted, and deleted after server-side Sharp processing. SVG uploads are not accepted.
- Forms are validated with Zod; descriptions remain plain text and are rendered through React escaping.
- Security headers disable framing, MIME sniffing, unnecessary browser capabilities, objects, and off-origin form submission.

