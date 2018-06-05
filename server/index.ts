import express from "express";
import path from "path";
import socketio from "socket.io";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import clientManager from "./ClientManager";

const webpackDevConfig = require("../../webpack.config.js");

const app = express();
const router = express.Router();
const isDevelopment = process.env.NODE_ENV !== "production";
const port = isDevelopment ? 3000 : Number(process.env.PORT);

if (isDevelopment) {
    const compiler = webpack({ ...webpackDevConfig, mode: "development" });
    const middleware = webpackMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler, {
        log: false,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000,
    }));
}

app.use(express.static(path.resolve(__dirname, "../")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "index.html"));
});

const server = app.listen(port, "0.0.0.0", (err: () => void | undefined) => {
    if (err) {
        console.log(err);
    }

    console.info("==> Listening on port %s.", port, port);
});

const io = socketio(server);

io.on("connection", (socket) => {
    clientManager.register(socket.id, (type, data) => {
        socket.emit("action", {
            type,
            ...data,
        });
    });

    socket.on("disconnect", () => {
        clientManager.deregister(socket.id);
    });

    socket.on("server/workspace/START", (data) => {
        clientManager.connect(socket.id, data.brokers);
    });
});
