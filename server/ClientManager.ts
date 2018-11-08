import * as kafka from "kafka-node";

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
            kafkaClient.close((err: any) => {
                if (err) {
                    console.error(err);
                }
            });
        }

        const consumer = socketObj.consumer;
        if (consumer) {
            consumer.close(true, (err: any) => {
                if (err) {
                    console.error(err);
                }
            });
        }

        delete this.clients[socketId];
    }

    dispose() {
        console.log("Shutting down server");

        Object.keys(this.clients).forEach((socketId) => {
            this.deregister(socketId);
        });
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

    startConsumer(socketId: string, topicId: string) {
        const existingConsumerGroup = this.clients[socketId].consumer;

        if (existingConsumerGroup) {
            existingConsumerGroup.close(true, (error: any) => {
                if (error) {
                    console.log("Failed to close consumer");
                    return;
                }

                this.clients[socketId].consumer = null;
                this.startConsumer(socketId, topicId);
            });
            return;
        }

        const consumerOptions = {
            kafkaHost: "kf01bk01.dev-plat.com:9092",
            groupId: "ExampleTestGroup",
            sessionTimeout: 15000,
            protocol: ["roundrobin"],
            fromOffset: "earliest",
          };

        const consumerGroup = new kafka.ConsumerGroup(
            Object.assign({id: "consumer1"}, consumerOptions),
            ["test-events-f4"]);
        this.clients[socketId].consumer = consumerGroup;

        consumerGroup.on("connect", () => {
            const socketObj = this.clients[socketId];

            socketObj.handler("topics/TOPICS_CONSUME_CONNECT", {
            });
        });

        consumerGroup.on("error", (err: any) => {
            const socketObj = this.clients[socketId];
            console.error(err);

            socketObj.handler("topics/TOPICS_CONSUME_ERROR", {
            });
        });

        consumerGroup.on("message", (msg: any) => {
            const socketObj = this.clients[socketId];

            if (!socketObj) {
                consumerGroup.close();
                return;
            }

            socketObj.handler("topics/TOPICS_CONSUME_RECEIVE", {
                topicId,
                messages: [{
                    id: `${msg.partition}${msg.offset}`,
                    ...msg,
                }],
            });
        });
    }
}

export default new ClientManager();
