import { Action } from "redux";
import { ErrorMessage } from "../models";

// State
export interface WorkspaceState {
    isLoading: boolean;
    isConnected: boolean;
    connectionStatus: ConnectionStatus;
    errors: ErrorMessage[];
}

export enum ConnectionStatus {
    Connected = "CONNECTED",
    Connecting = "CONNECTING",
    Disconnected = "DISCONNECTED",
    Failed = "FAILED",
}

const initialState: WorkspaceState = {
    isLoading: false,
    isConnected: false,
    connectionStatus: ConnectionStatus.Disconnected,
    errors: [],
};

// Actions
enum WorkspaceActionKeys {
    StartLoad = "workspace/load_start",
    StopLoad = "workspace/load_stop",
    ReceiveConnectionStatus = "workspace/CONNECTIONSTATUS_RESPONSE",
    ReceiveError = "workspace/ERROR",
    StartConnection = "server/workspace/START",
    RegisterError = "workspace/register_error",
}

interface ReceiveConnectionStatusAction {
    type: WorkspaceActionKeys.ReceiveConnectionStatus;
    connectionStatus: ConnectionStatus;
}

interface ReceiveErrorAction {
    type: WorkspaceActionKeys.ReceiveError;
    error: ErrorMessage;
}

interface RegisterErrorAction {
    type: WorkspaceActionKeys.RegisterError;
    error: ErrorMessage;
}

export const registerError = (error: ErrorMessage): RegisterErrorAction => {
    return {
        type: WorkspaceActionKeys.RegisterError,
        error,
    };
};

interface StartLoadAction extends Action {
    type: WorkspaceActionKeys.StartLoad;
}

export const startLoad = (): StartLoadAction => {
    return {
        type: WorkspaceActionKeys.StartLoad,
    };
};

interface StopLoadAction extends Action {
    type: WorkspaceActionKeys.StopLoad;
}

export const stopLoad = (): StopLoadAction => {
    return {
        type: WorkspaceActionKeys.StopLoad,
    };
};

interface StartConnectionAction extends Action {
    type: WorkspaceActionKeys.StartConnection;
    brokers: string;
}

export const startConnection = (brokers: string) => {
    return {
        type: WorkspaceActionKeys.StartConnection,
        brokers,
    };
};

type WorkspaceActions = StartLoadAction | StopLoadAction | ReceiveConnectionStatusAction | ReceiveErrorAction;

// Reducers
export default function workspaceReducer(
    state: WorkspaceState = initialState,
    action: WorkspaceActions): WorkspaceState {
    switch (action.type) {
        case WorkspaceActionKeys.StartLoad:
            return {
                ...state,
                isLoading: true,
            };
        case WorkspaceActionKeys.StopLoad:
            return {
                ...state,
                isLoading: false,
            };
        case WorkspaceActionKeys.ReceiveConnectionStatus:
            return {
                ...state,
                connectionStatus: action.connectionStatus,
            };
        case WorkspaceActionKeys.ReceiveError:
            return {
                ...state,
                errors: state.errors.concat(action.error),
            };
        default:
            return state;
    }
}
