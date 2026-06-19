# OpenCart local Docker stack

```
docker compose up -d
docker compose logs -f opencart   # wait for "** OpenCart setup finished! **"
```

Then:
- Storefront: http://localhost:8080
- Admin:      http://localhost:8080/administration   (user / bitnami)
- phpMyAdmin: http://localhost:8888                  (bn_opencart / opencart_pw_change_me)
- MailHog UI: http://localhost:8025                  (catches outbound mail)

## Snapshot / restore the clean DB

```bash
# Snapshot
docker compose exec mariadb \
  mysqldump -ubn_opencart -popencart_pw_change_me bitnami_opencart \
  > ../seeds/opencart_clean.sql

# Restore
docker compose exec -T mariadb \
  mysql -ubn_opencart -popencart_pw_change_me bitnami_opencart \
  < ../seeds/opencart_clean.sql
```
