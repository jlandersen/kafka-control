import React from "react";
import { FaCircle } from "react-icons/fa";

import { ConnectionStatus } from "../../redux/workspace";

import "./Header.css";

interface HeaderProps {
    connectionStatus: ConnectionStatus;
}

export default class Header extends React.PureComponent<HeaderProps> {
    readonly connectionStatusMapping = {
        [ConnectionStatus.Connected]: {
            color: "green",
            statusText: "connected",
        },
        [ConnectionStatus.Connecting]: {
            color: "yellow",
            statusText: "connecting",
        },
        [ConnectionStatus.Disconnected]: {
            color: "gray",
            statusText: "disconnected",
        },
        [ConnectionStatus.Failed]: {
            color: "red",
            statusText: "failed to connect",
        },
    };

    render() {
        const connectionStatusDisplayValues = this.connectionStatusMapping[this.props.connectionStatus];

        return (
            <header>
                <div className="header__title">
                    <h1>KFC <span className="header__titlesub">Kafka Control</span></h1>
                </div>

                <div className="header__connection">
                    <FaCircle
                        color={connectionStatusDisplayValues.color}
                        width={15}
                        height={15} /> {connectionStatusDisplayValues.statusText}
                </div>
            </header>
        );
    }
}
