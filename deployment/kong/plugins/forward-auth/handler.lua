local http = require "resty.http"

local ForwardAuth = {
  PRIORITY = 1000,
  VERSION = "1.0.0",
}

local function unauthorized(message)
  return kong.response.exit(401, { message = message })
end

function ForwardAuth:access(config)
  local method = kong.request.get_method()
  -- Browser preflight requests do not contain an access token.
  if method == "OPTIONS" then
    return
  end

  -- Never trust an identity header supplied by the client.
  kong.service.request.clear_header("X-User-Id")

  local authorization = kong.request.get_header("Authorization")
  if not authorization or not authorization:match("^Bearer%s+%S+$") then
    return unauthorized("Missing or invalid Authorization header")
  end

  local client = http.new()
  client:set_timeout(config.timeout_ms)

  local response, error_message = client:request_uri(config.auth_url, {
    method = "GET",
    headers = {
      Authorization = authorization,
      Accept = "text/plain",
    },
    keepalive = true,
  })

  if not response then
    kong.log.err("AuthService ping failed: ", error_message)
    return kong.response.exit(503, {
      message = "Authentication service unavailable",
    })
  end

  if response.status == 401 or response.status == 403 then
    return unauthorized("Invalid or expired access token")
  end

  if response.status ~= 200 then
    kong.log.err("AuthService ping returned status ", response.status)
    return kong.response.exit(503, {
      message = "Authentication service unavailable",
    })
  end

  local user_id = response.body and response.body:match("^%s*(.-)%s*$")
  if not user_id or user_id == "" or not user_id:match("^[%w%-]+$") then
    kong.log.err("AuthService ping returned an invalid user id")
    return kong.response.exit(502, {
      message = "Invalid authentication response",
    })
  end

  -- ExpenseService and other upstream services can trust this header because
  -- Kong cleared the client value and created it from AuthService's response.
  kong.service.request.set_header("X-User-Id", user_id)
end

return ForwardAuth
