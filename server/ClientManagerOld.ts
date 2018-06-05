import kafka from "kafka-node";

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

        const consumerGroup = socketObj.consumer;

        if (consumerGroup) {
            consumerGroup.close();
        }

        delete this.clients[socketId];
    }

    connect(socketId: string, brokers: string) {
        const socketObj = this.clients[socketId];

        const kafkaClient = new kafka.KafkaClient({
            kafkaHost: brokers,
        });

        kafkaClient.on("connect", () => {
            // Nothing
        });

        kafkaClient.on("ready", () => {
            socketObj.handler("workspace/CONNECTEDSTATUS_RECEIVE", {});

            socketObj.handler("brokers/BROKERS_RECEIVE", {
                brokers: kafkaClient.brokerMetadata,
            });

            const topicsById: any = {};
            for (const topicId in kafkaClient.topicMetadata) {
                if (!kafkaClient.topicMetadata.hasOwnProperty(topicId)) {
                    continue;
                }

                const topic = kafkaClient.topicMetadata[topicId];

                topicsById[topicId] = {
                    id: topicId,
                    partitionCount: Object.keys(topic).length,
                    replicationFactor: topic[0].replicas.length,
                    partitions: topic,
                };
            }

            socketObj.handler("topics/TOPICS_RECEIVE", {
                topicMetadata: topicsById,
            });

            kafkaClient.loadMetadataForTopics([], (error: any, results: any) => {
                if (error) {
                    // test
                }
            });
        });

        kafkaClient.on("error", () => {
            socketObj.handler("workspace/ERROR_RECEIVE", {});
        });

        socketObj.kafkaClient = kafkaClient;
    }

    startConsumer(socketId: string, topicId: string) {
        const existingConsumerGroup = this.clients[socketId].consumer;

        if (existingConsumerGroup) {
            existingConsumerGroup.close();
        }

        const options = {
            kafkaHost: "52.157.162.92:9092",
            groupId: "sample" + topicId,
            sessionTimeout: 15000,
            protocol: ["roundrobin"],
            fromOffset: "latest",
        };

        const consumerGroup = new kafka.ConsumerGroup(options, topicId);
        this.clients[socketId].consumer = consumerGroup;

        consumerGroup.on("error", (err: any) => {
            console.error(err);
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
