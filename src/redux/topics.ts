import { Action } from "redux";
import { createSelector } from "reselect";

// State
export interface TopicsState {
    items: {
        [id: string]: Topic,
    };
    messagesByTopicId: {
        [topicId: string]: ConsumerMessage[];
    };
    selectedTopicId?: string;
}

export interface Topic {
    id: string;
    partitionCount: number;
    replicationFactor: number;
    partitions: {
        [partitionId: number]: TopicPartition;
    };
}

export interface TopicPartition {
    topic: string;
    isr: number[];
    leader: number;
    partition: number;
    replicas: number[];
}

export interface ConsumerMessage {
    id: string;
    topic: string;
    key: string;
    offset: number;
    partition: number;
    value: string;
}

const initialState: TopicsState = {
    items: {},
    messagesByTopicId: {},
};

// Selectors
const topicItemsSelector = (state: TopicsState) => state.items;
const selectedTopicSelector = (state: TopicsState) => state.selectedTopicId;

export const getTopicIds = createSelector(topicItemsSelector, (items) => Object.keys(items));

export const getTopics = createSelector(topicItemsSelector, (items) => {
    const result = [];
    for (const topic in items) {
        if (!items.hasOwnProperty(topic)) {
            continue;
        }

        result.push(items[topic]);
    }

    return result;
});

export const getSelectedTopicPartitions = createSelector(
    topicItemsSelector,
    selectedTopicSelector,
    (topics, selectedTopicId) => {
    if (!selectedTopicId) {
        return [];
    }

    const topic = topics[selectedTopicId];

    if (!topic) {
        return [];
    }

    const partitions: TopicPartition[] = [];
    for (const partition in topic.partitions) {
        if (!topic.partitions.hasOwnProperty(partition)) {
            continue;
        }

        partitions.push(topic.partitions[partition]);
    }

    return partitions;
});

export const getTopicMessages = (state: TopicsState, topicId: string) => {
    const topicMessages = state.messagesByTopicId[topicId];

    if (!topicMessages) {
        return [];
    }

    return topicMessages;
};

// Actions
enum TopicsActionKeys {
    FetchTopics = "server/topics/TOPICS_FETCH",
    ConsumeTopic = "server/topics/TOPICS_CONSUME",
    ReceiveTopics = "topics/FETCH_TOPICS_RESPONSE",
    ReceiveMessages = "topics/TOPICS_CONSUME_RECEIVE",
    SelectTopic = "topics/SELECT_TOPIC",
}

interface FetchTopicsAction extends Action {
    type: TopicsActionKeys.FetchTopics;
}

export const fetchTopics = (): FetchTopicsAction => {
    return {
        type: TopicsActionKeys.FetchTopics,
    };
};

interface ConsumeTopicAction extends Action {
    type: TopicsActionKeys.ConsumeTopic;
    topicId: string;
}

export const startConsumerForTopic = (topicId: string): ConsumeTopicAction => {
    return {
        type: TopicsActionKeys.ConsumeTopic,
        topicId,
    };
};

interface ReceiveTopicsAction extends Action {
    type: TopicsActionKeys.ReceiveTopics;
    topicMetadata: any;
}

interface ReceiveMessagesAction extends Action {
    type: TopicsActionKeys.ReceiveMessages;
    topicId: string;
    messages: ConsumerMessage[];
}

interface SelectTopicAction extends Action {
    type: TopicsActionKeys.SelectTopic;
    topicId: string;
}

export const selectTopic = (topicId: string): SelectTopicAction => {
    return {
        type: TopicsActionKeys.SelectTopic,
        topicId,
    };
};

type TopicsActions = ReceiveTopicsAction |
    ConsumeTopicAction |
    FetchTopicsAction |
    ReceiveMessagesAction |
    SelectTopicAction;

// Reducers
export default function topicsReducer(state: TopicsState = initialState, action: TopicsActions): TopicsState {
    switch (action.type) {
        case TopicsActionKeys.ReceiveTopics:
            return {
                ...state,
                items: action.topicMetadata,
            };
        case TopicsActionKeys.ReceiveMessages:
            let messages = state.messagesByTopicId[action.topicId];

            if (!messages) {
                messages = [];
            }

            return {
                ...state,
                messagesByTopicId: {
                    ...state.messagesByTopicId,
                    [action.topicId]: [...messages, ...action.messages],
                },
            };
        case TopicsActionKeys.ConsumeTopic:
            return {
                ...state,
            };
        case TopicsActionKeys.SelectTopic: {
            return {
                ...state,
                selectedTopicId: action.topicId,
            };
        }
    }
    return state;
}
