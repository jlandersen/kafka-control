export interface Broker {
    nodeId: number;
    host: string;
    port: number;
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
