import kafka from "kafka-node";
import { isNullOrUndefined } from "util";

export type ActionHandler = (type: string, data: any) => void;

class ClientManager {
    clients: {
        [id: string]: {
            kafkaClient?: any;
            consumer?: any;
            handler: ActionHandler;
        };
    };

    constructor() {
        this.clients = {};
    }

    register(socketId: string, handler: ActionHandler) {
        this.clients[socketId] = {
            handler,
        };
    }

    deregister(socketId: string) {
        const socketObj = this.clients[socketId];

        if (!socketObj) {
            return;
        }

        const kafkaClient = socketObj.kafkaClient;
        if (kafkaClient) {
            kafkaClient.close();
        }

        delete this.clients[socketId];
    }

    connect(socketId: string, brokers: string) {
        const socketObj = this.clients[socketId];

        const kafkaClient = new kafka.KafkaClient({
            kafkaHost: brokers,
            connectTimeout: 2000,
            connectRetryOptions: {
                retries: 1,
            },
        });

        socketObj.handler("workspace/CONNECTIONSTATUS_RESPONSE", {
            connectionStatus: "CONNECTING",
        });

        kafkaClient.on("connect", () => {
            // Nothing yet
        });

        kafkaClient.on("ready", () => {
            socketObj.handler("workspace/CONNECTIONSTATUS_RESPONSE", {
                connectionStatus: "CONNECTED",
            });

            socketObj.handler("brokers/FETCH_BROKERS_RESPONSE", {
                brokers: kafkaClient.brokerMetadata,
            });

            const topicsById: any = {};
            for (const topicId in kafkaClient.topicMetadata) {
                if (!kafkaClient.topicMetadata.hasOwnProperty(topicId)) {
                    continue;
                }

                const topic = kafkaClient.topicMetadata[topicId];
                const keys = Object.keys(topic)[0];

                let partitionCount = 0;
                let replicationFactor = 0;

                if (keys) {
                    partitionCount = Object.keys(topic).length;
                    replicationFactor = topic[keys].replicas.length;
                }

                topicsById[topicId] = {
                    id: topicId,
                    partitionCount,
                    replicationFactor,
                    partitions: topic,
                };
            }

            socketObj.handler("topics/FETCH_TOPICS_RESPONSE", {
                topicMetadata: topicsById,
            });
        });

        kafkaClient.on("error", () => {
            socketObj.handler("workspace/ERROR_RESPONSE", {
                error: {
                    error: "Unable to connect",
                    message: "Unable to connect to " + brokers,
                },
            });

            socketObj.handler("workspace/CONNECTIONSTATUS_RESPONSE", {
                connectionStatus: "FAILED",
            });
        });

        socketObj.kafkaClient = kafkaClient;
    }
}

export default new ClientManager();
