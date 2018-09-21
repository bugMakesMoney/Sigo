"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const parse_1 = require("../utils/parse");
const util_1 = require("../utils/util");
const config_1 = require("../constants/config");
class serverConfig {
    constructor(verifyToken, server) {
        this.requestCallback = (req, res) => {
            const { method } = req;
            const { path, query } = parse_1.parseUrl(req.url);
            util_1.isSame(path, this.webhook)
                ? method === 'GET'
                    ? this.requestGET(res, query)
                    : method === 'POST'
                        ? this.requestPOST(req, res)
                        : ((res.statusCode = 403),
                            console.warn(`${method} is not allowed method`),
                            res.end(`${method} is not allowed method`))
                : ((res.statusCode = 403),
                    console.warn(`${path} is not webhook url`),
                    res.end(`${path} is not webhook url`));
        };
        Object.entries(this.setServerConfig(verifyToken)).forEach(([key, value]) => {
            this[key] = value;
        });
        if (server)
            this.connectServer(server);
        if (!server)
            this.createServer();
    }
    setServerConfig(verifyToken) {
        return {
            verifyToken,
            webhook: config_1.WebhookUrl,
            endpoint: config_1.Endpoint,
            version: config_1.EndpointVersion,
        };
    }
    setWebhook(webhookUrl) {
        this.webhook = webhookUrl;
        return function (req, res, next) {
            const { path } = parse_1.parseUrl(req.url);
            if (path == this.webhook)
                return;
            next();
        }.bind(this);
    }
    createServer() {
        console.log('create');
        this.server = Http.createServer(this.requestCallback);
    }
    connectServer(server) {
        console.log('connect');
        this.server = server;
        this.server.on('request', this.requestCallback);
    }
    requestGET(res, query) {
        const verify_token = query['hub.verify_token'];
        const mode = query['hub.mode'];
        const challenge = query['hub.challenge'];
        console.log('get verify token', verify_token);
        console.log('input verify token', this.verifyToken);
        if (mode === 'subscribe' && verify_token === this.verifyToken) {
            res.writeHead(200);
            res.end(challenge);
            console.log('challenge', challenge);
            return;
        }
        res.writeHead(403);
        if (verify_token) {
            console.warn(`${verify_token} is not verify token`);
            res.end(`${verify_token} is not verify token`);
        }
        res.end('verify token not found');
    }
    async requestPOST(req, res) {
        req.setEncoding('utf-8');
        let body;
        await req.on('data', chunk => {
            body = JSON.parse(chunk);
        });
        const { object, entry } = body;
        if (object === 'page') {
            entry.forEach(entry => {
                const webhook_event = entry.messaging[0];
                //handle webhook event
                console.log('webhook event', webhook_event);
            });
            res.statusCode = 200;
            console.log('event received');
            res.end('event received');
        }
        else {
            console.warn('object is not page');
            res.end('object is not page');
            res.statusCode = 404;
            res.end();
        }
    }
    listen(port) {
        if (!port)
            throw new Error('port number is not defined');
        this.server.listen(port, () => {
            console.log('listen', port);
        });
    }
}
exports.default = serverConfig;
