# Auth API

Authentication in Relavo is primarily handled by **Supabase Auth**, but the Backend provides a proxy for user profile management.

## Purpose
To manage user sessions and account-level settings.

## Integration Details
Relavo uses JSON Web Tokens (JWT) issued by Supabase. Every request to the `/api` must include the JWT in the `Authorization` header.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/profile` | Update user settings (e.g., notification preferences) |
| GET | `/api/auth/me` | Get current user's profile and plan details |

## Environment Variables required for Auth
- `SUPABASE_URL`: The URL of your Supabase project.
- `SUPABASE_ANON_KEY`: Public key used for frontend login.
- `JWT_SECRET`: Used by the Backend to verify Supabase tokens.

## Example Request Header
```http
Authorization: Bearer <SUPABASE_JWT_TOKEN>
```

## User Flow
1. User signs up via the Frontend using Supabase Auth.
2. Supabase returns a JWT.
3. Frontend stores the JWT and includes it in all subsequent calls to the Backend API.
4. Backend verifies the JWT using the `JWT_SECRET` and extracts the `user_id`.
