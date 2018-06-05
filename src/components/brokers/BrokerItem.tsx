import React from "react";
import Server from "react-icons/lib/fa/server";

import { Broker } from "../../models";

import "./BrokerItem.css";

interface BrokerItemProps {
    broker: Broker;
}

export default class BrokerItem extends React.PureComponent<BrokerItemProps, {}> {
    render() {
        return (
            <div className="brokeritem">
                <div>
                    <Server color={"#000"} /> <span className="brokeritem__nodeid">#{this.props.broker.nodeId}</span>
                </div>
                <div>
                    Host: {this.props.broker.host}
                </div>
                <div>
                    Port: {this.props.broker.port}
                </div>
            </div>
        );
    }
}
