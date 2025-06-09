# Set up example project

### Nginx as reverse proxy

- Install nginx `apt install nginx`
- Copy server.conf from nginx-reverse-proxy folder to `/etc/nginx/sites-available/server.conf`
- Create symlink `ln -s /etc/nginx/sites-available/server.conf /etc/nginx/sites-enabled/server.conf`
- Copy folder `out` from agent to `/var/www/server/out`
- Restart nginx `systemctl reload nginx`

#### MITM protection between your server and cloudflare proxy

- Create origin certificates in the cloudflare dashboard (TLS section)
- Copy them to the folders see nginx configuration

```nginx
    ssl_certificate         /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key     /etc/ssl/cloudflare/key.pem;
    ssl_trusted_certificate /etc/ssl/cloudflare/cert.pem;
```

- Only cloudflare proxy servers IPs are allowed in the configuration

```nginx
    allow 173.245.48.0/20;
    allow 103.21.244.0/22;
    allow 103.22.200.0/22;
    allow 103.31.4.0/22;
    allow 141.101.64.0/18;
    allow 108.162.192.0/18;
    allow 190.93.240.0/20;
    allow 188.114.96.0/20;
    allow 197.234.240.0/22;
    allow 198.41.128.0/17;
    allow 162.158.0.0/15;
    allow 104.16.0.0/13;
    allow 104.24.0.0/14;
    allow 172.64.0.0/13;
    allow 131.0.72.0/22;

    allow 2400:cb00::/32;
    allow 2606:4700::/32;
    allow 2803:f800::/32;
    allow 2405:b500::/32;
    allow 2405:8100::/32;
    allow 2a06:98c0::/29;
    allow 2c0f:f248::/32;

    deny all;
```

### Install dependencies

- Node Version Manager `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
- NodeJS `nvm install 24`
- Process Manager `npm install pm2 -g`

### Run tunnel

- Go to `/tunnel` and run `pm2 start --name tunnel npm -- run start`

### Run auth server (only for test)

- Go to `/examples/auth-server` and run `pm2 start --name auth-server npm -- run start`

## Now you can access your OBS securely and remotely from anywhere

- Open the url `https://your-domain.com/agent` where you have OBS running
- Fill in the Token with the value `f2EazDD18Wm5XQHJ1qEge7bd0VXL0B` and the Endpoint with the value `wss://your-domain.com/ws`
- For testing, you can use an external project https://obs-web.niek.tv/, where you just need to fill the url with the value `wss://your-domain.com/ws?token=C8UfZSjbeNcrDtGJEf1vn5hQQp699J`
