# HTTPS with Nginx + Let's Encrypt

1. Set `SERVER_NAME` and `CERTBOT_EMAIL` in `.env`.
2. Start base stack:

```bash
docker compose up -d --build
```

3. Request the first certificate:

```bash
docker compose --profile setup run --rm certbot-init
docker compose restart nginx
```

4. Verify HTTPS:

```bash
curl -I https://$SERVER_NAME
```

After that, the `certbot` service renews certificates automatically every 12 hours and reloads nginx after successful renewal.
