import React from "react";
import { FaBars, FaTable } from "react-icons/fa";
import { connect } from "react-redux";
import { match } from "react-router";
import { bindActionCreators, Dispatch } from "redux";

import { AppState } from "../../redux";
import { ConsumerMessage, getTopicMessages, selectTopic, TopicPartition } from "../../redux/topics";
import { getSelectedTopicPartitions, startConsumerForTopic } from "../../redux/topics";

import "./Viewer.css";
import Stream from "./Stream";

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

const mapStateToProps = (state: AppState, ownProps: { match: match<{ id: string }> }): ViewerProps => {
    const selectedTopicId = ownProps.match.params.id;
    return {
        topicId: selectedTopicId,
        partitions: getSelectedTopicPartitions(state.topics),
        messages: getTopicMessages(state.topics, selectedTopicId),
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

class Viewer extends React.Component<ViewerProps & ViewerDispatchProps, {}> {
    componentDidMount() {
        this.props.actions.onSelectTopic(this.props.topicId);
    }

    render() {
        const partitions = this.props.partitions.map((p) =>
            <li key={p.partition}>
                <span className="viewer__partition_id">{p.partition}</span> -
                 Leader: {p.leader}, ISR: {p.isr.join(",")}, Replicas: {p.replicas.join(",")}
            </li>);
        // const items = this.props.messages.map((m) => <RecordItem key={m.id} value={m.value} />);

        return (
            <div className="viewer">
                <h1>Topic: {this.props.topicId} </h1>
                <div className="viewer__partitions">
                    <h2><FaBars style={{ verticalAlign: "sub" }} /> Partitions</h2>
                    <ul>
                        {partitions}
                    </ul>
                </div>

                <div className="viewer__stream">
                    <h2><FaTable style={{ verticalAlign: "top" }} /> Stream</h2>
                    <button onClick={() => this.props.actions.onStartConsumer(this.props.topicId)}>
                        Click here to start consuming messages
                    </button>
                    <ul>
                        <Stream lines={this.props.messages} />
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchFromProps)(Viewer);
