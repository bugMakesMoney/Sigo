"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("../utils/parse");
const util_1 = require("../utils/util");
const Http = require("http");
class clientConfig {
    constructor(_verifyToken, _server) {
        this.requestCallback = (req, res) => {
            const { method } = req;
            const { path, query } = parse_1.parseUrl(req.url);
            util_1.isSame(path, this.webhookUrl)
                ? method === 'GET'
                    ? this.requestGET(res, query)
                    : method === 'POST'
                        ? this.requestPOST(req, res)
                        : ((res.statusCode = 403), res.end(`${method} is not allowed method`))
                : ((res.statusCode = 403), res.end(`${path} is not webhook url`));
        };
        this.verifyToken = _verifyToken;
        if (_server)
            this.connectServer(_server);
        if (!_server)
            this.createServer();
    }
    createServer() {
        this.server = Http.createServer(this.requestCallback);
    }
    connectServer(_server) {
        this.server = _server;
        this.server.on('request', this.requestCallback);
    }
    setWebhook(_webhookUrl) {
        this.webhookUrl = _webhookUrl;
        return function (req, res, next) {
            const { path } = parse_1.parseUrl(req.url);
            if (path == this.webhookUrl)
                return;
            next();
        }.bind(this);
    }
    requestGET(res, query) {
        const verify_token = query['hub.verify_token'];
        const mode = query['hub.mode'];
        const challenge = query['hub.challenge'];
        if (mode === 'subscribe' && verify_token === this.verifyToken) {
            res.writeHead(200);
            res.end(challenge);
            return;
        }
        res.writeHead(403);
        if (verify_token) {
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
            });
            res.statusCode = 200;
            res.end('event received');
        }
        else {
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
exports.clientConfig = clientConfig;
