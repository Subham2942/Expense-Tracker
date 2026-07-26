# Forward Auth Kong plugin

The plugin is attached to UserService, ExpenseService, and DSService in
`config/kong.yml`. AuthService does not use the plugin because it handles its
own login, signup, refresh, logout, and JWT validation.

For each protected request it:

1. Removes any client-provided `X-User-Id`.
2. Sends the request's bearer token to AuthService `/auth/v1/ping`.
3. Returns `401` when AuthService rejects the token.
4. Adds the user ID returned by AuthService as `X-User-Id`.
5. Allows Kong to proxy the original request to its upstream service.

`OPTIONS` requests are excluded so browser CORS preflight is not treated as an
authenticated request.
