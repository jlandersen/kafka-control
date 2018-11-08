import React from "react";
import { FaBars, FaCheckCircle, FaTable } from "react-icons/fa";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { AppState } from "../../redux";
import { ConsumerMessage, getTopicMessages, selectTopic, TopicPartition } from "../../redux/topics";
import { getSelectedTopicPartitions, startConsumerForTopic } from "../../redux/topics";

import "./Viewer.css";

import Stream from "./Stream";
import PartitionItem from "./PartitionItem";

interface ViewerProps {
    topicId: string;
    partitions: TopicPartition[];
    messages: ConsumerMessage[];
}

interface ViewerDispatchProps {
    actions: {
        onSelectTopic(topicId: string): any;
        onStartConsumer(topicId: string): any;
    };
}

interface ViewerState {
    isStreaming: boolean;
}

const mapStateToProps = (state: AppState): ViewerProps => {
    return {
        topicId: state.topics.selectedTopicId!,
        partitions: getSelectedTopicPartitions(state.topics),
        messages: getTopicMessages(state.topics, state.topics.selectedTopicId!),
    };
};

const mapDispatchFromProps = (dispatch: Dispatch): ViewerDispatchProps => {
    return {
        actions: {
            onSelectTopic: bindActionCreators(selectTopic, dispatch),
            onStartConsumer: bindActionCreators(startConsumerForTopic, dispatch),
        },
    };
};

class Viewer extends React.Component<ViewerProps & ViewerDispatchProps, ViewerState> {
    state: ViewerState = {
        isStreaming: false,
    };

    componentDidMount() {
        this.props.actions.onSelectTopic(this.props.topicId);
    }

    componentDidUpdate(prevProps: ViewerProps) {
        if (prevProps.topicId === this.props.topicId) {
            return;
        }

        this.setState((prev) => {
            return {
                ...prev,
                isStreaming: false,
            };
        });
    }

    startConsumer() {
        this.props.actions.onStartConsumer(this.props.topicId);
        this.setState((prev) => {
            return {
                ...prev,
                isStreaming: true,
            };
        });
    }

    render() {
        const partitions = this.props.partitions.map((p) =>
            <PartitionItem key={p.partition} partition={p} />);
        // const items = this.props.messages.map((m) => <RecordItem key={m.id} value={m.value} />);

        return (
            <div className="viewer">
                <h1>Topic: {this.props.topicId} </h1>
                <div className="viewer__partitions">
                    <h2><FaBars style={{ verticalAlign: "sub" }} /> Partitions</h2>
                    <div className="brokers__list">
                        {partitions}
                    </div>
                </div>

                <div className="viewer__stream">
                    <h2><FaTable style={{ verticalAlign: "top" }} /> Stream</h2>
                    <button onClick={() => this.startConsumer() }>
                        Click here to start consuming messages
                    </button>
                    <ul>
                        <Stream lines={this.props.messages} isVisible={this.state.isStreaming} />
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchFromProps)(Viewer);
