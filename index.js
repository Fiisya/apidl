const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

let totalRequests = 0;
let clients = [];

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: "Terlalu banyak permintaan, coba lagi nanti." },
    keyGenerator: (req) => {
        return req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    totalRequests++;
    sendUpdateToClients();
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/monitor-page", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "monitor", "monitor.html"));
});

app.get("/monitor", (req, res) => {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    res.write(`data: ${JSON.stringify({ totalRequests })}\n\n`);

    req.on("close", () => {
        clients = clients.filter(client => client.id !== clientId);
    });
});

function sendUpdateToClients() {
    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify({ totalRequests })}\n\n`);
    });
}

const routes = [
    "ytdl", "twitterdl", "igdl", "fbdl", "ttdl", "gitclone", "spotifydl",
    "githubstalk", "searchgroups", "randommeme", "ttsearch", "ytsearch", "npmsearch", "googlesearch",
    "pinterest", "spotifysearch", "gistalk", "llama-3.3-70b-versatile", "gemini",
    "txt2img", "genshinbuild", "ssweb", "translate", "nulis", "cuaca", "qrcodegenerator",
    "vcc", "cekkhodam", "tahukahkamu", "brat", "qc", "detiknews", "kompasnews"
];
routes.forEach(route => {
    app.use(`/api/${route}`, limiter, require(`./api/${route}`));
});

module.exports = app;
