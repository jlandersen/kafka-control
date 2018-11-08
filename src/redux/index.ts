import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import io from "socket.io-client";

import brokersReducer, { BrokerState } from "./brokers";
import socketMiddleware from "./middleware/socketMiddleware";
import topicsReducer, { TopicsState } from "./topics";
import workspaceReducer, { ConnectionStatus, WorkspaceState } from "./workspace";

const socket = io(document.location!.origin);

// Set initial selected topic id based on url
const topicsSegment = "/topics/";
let selectedTopicId;
if (document.location!.pathname.startsWith(topicsSegment)) {
    selectedTopicId = document.location!.pathname.slice(document.location!.pathname.lastIndexOf("/") + 1);
}

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
        selectedTopicId,
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
