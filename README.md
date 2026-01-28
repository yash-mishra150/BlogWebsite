## Blog Frontend (Next.js)

Simple blog UI wired to the deployed API.

**API Base**: https://blogwebsite-iz96.onrender.com/api/v1

### Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Features

- Home list with filters and pagination: [app/page.tsx](app/page.tsx)
- Blog detail + quick edit/delete: [app/blog/[id]/page.tsx](app/blog/%5Bid%5D/page.tsx)
- Login: [app/login/page.tsx](app/login/page.tsx)
- Register: [app/register/page.tsx](app/register/page.tsx)
- Create blog (multipart upload): [app/create/page.tsx](app/create/page.tsx)
- Profile (requires token): [app/profile/page.tsx](app/profile/page.tsx)
- Navbar: [components/Navbar.tsx](components/Navbar.tsx)

### API Layer

- Config/base URL: [lib/config.ts](lib/config.ts)
- Auth token helpers: [lib/auth.ts](lib/auth.ts)
- API calls: [lib/api.ts](lib/api.ts)

### Notes

- Update/Delete endpoints are currently open on the API, so quick edit works without auth.
- Create and profile require a JWT in localStorage (`token`). Login stores it automatically.
