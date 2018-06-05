import React from "react";
import Bars from "react-icons/lib/fa/bars";
import Table from "react-icons/lib/fa/table";
import { connect, Dispatch } from "react-redux";
import { match } from "react-router";
import { bindActionCreators } from "redux";

import { AppState } from "../../redux";
import { ConsumerMessage, getTopicMessages, selectTopic, TopicPartition } from "../../redux/topics";
import { getSelectedTopicPartitions, startConsumerForTopic } from "../../redux/topics";
import RecordItem from "./RecordItem";

import "./Viewer.css";

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

class Viewer extends React.PureComponent<ViewerProps & ViewerDispatchProps, {}> {
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
                <h2><Bars style={{ verticalAlign: "sub" }} /> Partitions</h2>
                <ul>
                    {partitions}
                </ul>

                {/* <h2><Table style={{ verticalAlign: "top" }} /> Data</h2>
                <button onClick={() => this.props.actions.onStartConsumer(this.props.topicId)}>
                    Click here to start processing messages
                </button>
                <ul>
                    {items}
                </ul> */}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchFromProps)(Viewer);
