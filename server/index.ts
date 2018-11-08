import * as express from "express";
import * as path from "path";
import * as socketio from "socket.io";

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

    app.get("*", (req: any, res: any) => {
        res.sendFile(path.resolve(__dirname, "../", "index.html"));
    });

    const server = app.listen(portNumber, "0.0.0.0", (err: () => void | undefined) => {
        if (err) {
            console.log(err);
        }

        console.info("==> Listening on port %s.", portNumber, portNumber);
    });

    const io = socketio(server);

    io.on("connection", (socket: any) => {
        clientManager.register(socket.id, (type, data) => {
            socket.emit("action", {
                type,
                ...data,
            });
        });

        socket.on("disconnect", () => {
            clientManager.deregister(socket.id);
        });

        socket.on("server/workspace/START", (data: any) => {
            clientManager.connect(socket.id, data.brokers);
        });

        socket.on("server/topics/TOPICS_CONSUME", (data: any) => {
            clientManager.startConsumer(socket.id, data.topicId);
        });
    });
}

process.once("SIGINT",  () => {
    clientManager.dispose();
});
