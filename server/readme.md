# VoiceBBS Server Setup

## Requirements

- NodeJS

## Envrionment

Server looks for the following environment variables on startup:

- `VBBS_MONGO_CONN` -- A MongoDB connection string
- `VBBS_SSL_KEY_FILE` -- SSL key file path
- `VBBS_SSL_CRT_FILE` -- SSL certificate file path
- `VBBS_CORS_HOST` -- Hostname of the client that will connect to this server
