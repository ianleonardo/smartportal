# Smart Analyst Portal

A front page for opening your applications. Each visit shuffles the apps and draws a new animated weather and landscape. Click an app to open its URL in a new browser tab.

## Configure the apps

Edit [`js/config.js`](js/config.js). Set the portal title and the list of applications. Each application needs a `name` and a `url`. `color` is optional.

```js
window.PORTAL = {
  title: "Smart Analyst Portal",
  apps: [
    { name: "Mail", url: "https://mail.google.com", color: "#5b8def" }
  ]
};
```

Refresh the page after saving. You do not need to restart Nginx.

## Start the server

Nginx runs in the background. The terminal does not have to stay open.

```bash
./start.sh
```

Then open:

- This computer: `http://localhost:8080`
- Another computer on the same Wi-Fi: `http://<this-computer-ip>:8080`

The script prints both addresses. Example: `http://192.168.0.82:8080`.

Stop the server:

```bash
./start.sh stop
```

To use a different port:

```bash
PORT=9090 ./start.sh
```

Nginx has to be installed first:

```bash
brew install nginx
```

If macOS asks for permission to accept incoming connections, allow Nginx. Other computers can only use the network address when they are on the same network. A phone on cellular data cannot open a `192.168.x.x` address.

## What is being served

`index.html`, `css/`, and `js/` are the whole site. `start.sh` writes a private Nginx config under `run/` and leaves Nginx running after the script exits.
