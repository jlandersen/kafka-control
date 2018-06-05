import React from "react";
import { connect } from "react-redux";

import { Broker } from "../../models";
import { AppState } from "../../redux";
import { getBrokerCount, getBrokers } from "../../redux/brokers";
import BrokerItem from "./BrokerItem";

import "./Brokers.css";

interface BrokerProps {
    brokers: Broker[];
    brokerCount: number;
}

const mapStateToProps = (state: AppState) => {
    return {
        brokers: getBrokers(state.brokers),
        brokerCount: getBrokerCount(state.brokers),
    };
};

class Brokers extends React.PureComponent<BrokerProps, {}> {
    render() {
        const brokersList = this.props.brokers.map((broker) => <BrokerItem key={broker.nodeId} broker={broker} />);

        return (
            <div className="brokers">
                <h1>Brokers ({this.props.brokerCount})</h1>
                 <div className="brokers__list">
                    {brokersList}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Brokers);
