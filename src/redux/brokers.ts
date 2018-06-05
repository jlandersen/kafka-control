import { Action } from "redux";
import { createSelector } from "reselect";
import { Broker } from "../models";

// State
export interface BrokerState {
    items: {
        [id: number]: Broker;
    };
}

const initialState: BrokerState = {
    items: {},
};

// Selectors
const brokerStateItemsSelector = (state: BrokerState) => state.items;

export const getBrokerCount = createSelector(brokerStateItemsSelector, (items) => {
    return Object.keys(items).length;
});

export const getBrokers = createSelector(brokerStateItemsSelector, (items) => {
    const result = [];
    for (const broker in items) {
        if (!items.hasOwnProperty(broker)) {
            continue;
        }

        result.push(items[broker]);
    }

    return result;
});

// Actions
enum BrokersActionKeys {
    ReceiveMetadata = "brokers/FETCH_BROKERS_RESPONSE",
    Other = "brokers/OTHER",
}

interface ReceiveBrokers {
    type: BrokersActionKeys.ReceiveMetadata;
    brokers: Broker[];
}

interface OtherAction {
    type: BrokersActionKeys.Other;
}

type BrokersActions = ReceiveBrokers | OtherAction;

// Reducers
export default function brokersReducer(state: BrokerState = initialState, action: BrokersActions): BrokerState {
    switch (action.type) {
        case BrokersActionKeys.ReceiveMetadata:
            return {
                ...state,
                items: action.brokers,
            };
    }

    return state;
}
