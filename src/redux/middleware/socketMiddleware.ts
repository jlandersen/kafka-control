/**
 * Redux middleware that handles all communication with Socket IO
 * Any actions dispatched from the client with a given type prefix will be emitted to the server.
 * Any events received as event type "action" will be dispatched.
 */
import { Middleware } from "redux";

export type SocketMiddleware = (socket: SocketIOClient.Socket, prefix?: string) => Middleware;

const defaultSocketActionprefix = "server/";
const shouldEmit = (type: string, prefix: string) => {
    return type.startsWith(defaultSocketActionprefix);
};

const socketMiddlewareFunc: SocketMiddleware = (socket, prefix) => {
    if (!prefix) {
        prefix = defaultSocketActionprefix;
    }

    return (store) => {
        socket.on("action", store.dispatch);
        socket.on("connect", () => console.log("connected"));
        socket.on("connect_error", (err: any) => console.error("connection error " + err));
        socket.on("error", (err: any) => console.error("error " + err));

        return (next) => (action: any) => {
            if (shouldEmit(action.type, prefix as string)) {
                socket.emit(action.type, action);
            }

            return next(action);
        };
    };
};

export default socketMiddlewareFunc;
