import { Action } from "redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Middleware } from "redux";
import thunkMiddleware from "redux-thunk";
import io from "socket.io-client";

import socketMiddleware from "../redux/middleware/socketMiddleware";
import brokersReducer, { BrokerState } from "./brokers";
import topicsReducer, { TopicsState } from "./topics";
import workspaceReducer, { ConnectionStatus, WorkspaceState } from "./workspace";

const socket = io(document.location.origin);

export interface AppState {
    workspace: WorkspaceState;
    topics: TopicsState;
    brokers: BrokerState;
}

const initialState: AppState = {
    workspace: {
        isConnected: false,
        connectionStatus: ConnectionStatus.Disconnected,
        isLoading: false,
        errors: [],
    },
    topics: {
        items: {},
        messagesByTopicId: {},
    },
    brokers: {
        items: {},
    },
};

const reducer = combineReducers({
    workspace: workspaceReducer,
    topics: topicsReducer,
    brokers: brokersReducer,
});

export default createStore(reducer, initialState, applyMiddleware(thunkMiddleware, socketMiddleware(socket)));
