local typedefs = require "kong.db.schema.typedefs"

return {
  name = "forward-auth",
  fields = {
    { consumer = typedefs.no_consumer },
    { protocols = typedefs.protocols_http },
    {
      config = {
        type = "record",
        fields = {
          {
            auth_url = {
              type = "string",
              required = true,
              default = "http://auth-service:9898/auth/v1/ping",
            },
          },
          {
            timeout_ms = {
              type = "integer",
              required = true,
              default = 2000,
              between = { 1, 60000 },
            },
          },
        },
      },
    },
  },
}
