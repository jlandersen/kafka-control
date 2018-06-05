import express from "express";
import path from "path";
import socketio from "socket.io";

import clientManager from "./ClientManager";

const app = express();
const router = express.Router();
const isDevelopment = process.env.NODE_ENV !== "production";
const port = isDevelopment ? 3000 : Number(process.env.PORT);

initServer(isDevelopment, port)
    .then(console.log)
    .catch(console.error);

async function initServer(developmentMode: boolean, portNumber: number) {
    if (isDevelopment) {
        const webpackDevConfig = require("../../webpack.config.js");
        const webpack = await import("webpack");
        const webpackMiddleware = await import("webpack-dev-middleware");
        const webpackHotMiddleware = await import("webpack-hot-middleware");
        const compiler = webpack.default({ ...webpackDevConfig, mode: "development" });
        const middleware = webpackMiddleware.default(compiler, {
            publicPath: webpackDevConfig.output.publicPath,
        });

        app.use(middleware);
        app.use(webpackHotMiddleware.default(compiler, {
            log: false,
            path: "/__webpack_hmr",
            heartbeat: 10 * 1000,
        }));
    }

    app.use(express.static(path.resolve(__dirname, "../")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../", "index.html"));
    });

    const server = app.listen(portNumber, "0.0.0.0", (err: () => void | undefined) => {
        if (err) {
            console.log(err);
        }

        console.info("==> Listening on port %s.", portNumber, portNumber);
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

}
