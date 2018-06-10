import { Location } from "history";
import React from "react";
import Ellipsis from "react-icons/lib/fa/ellipsis-h";
import Server from "react-icons/lib/fa/server";

import { Topic } from "../../redux/topics";
import NavLinkItem from "./NavLinkItem";

import "./Nav.css";

interface NavProps {
    topics: Topic[];
    brokerCount: number;
    location: Location;
}

export default class Nav extends React.PureComponent<NavProps> {
    render() {
        return (
            <nav>
                <span className="nav__grouptitle">Cluster</span>
                <ul>
                    <li>
                        <NavLinkItem activeClassName="active" path={"/brokers"} location={this.props.location}>
                            <div className="nav__linkitem">
                                <div>
                                    <Server color={"#fff"} />
                                </div>
                                <div className="nav__linkitemcontent">
                                    <div>
                                        Brokers
                                            </div>
                                    <div className="nav__linkitemdetails">
                                        Total: {this.props.brokerCount}
                                    </div>
                                </div>
                            </div>
                        </NavLinkItem>
                    </li>
                </ul>
                <span className="nav__grouptitle">Topics</span>
                <div className="nav__topics">
                    <ul>
                        {this.props.topics.map((topic) =>
                            <li key={topic.id}>
                                <NavLinkItem
                                    activeClassName="active"
                                    path={`/topics/${topic.id}`}
                                    location={this.props.location}>
                                    <div className="nav__linkitem">
                                        <div>
                                            <Ellipsis color={"#fff"} />
                                        </div>
                                        <div className="nav__linkitemcontent">
                                            <div>
                                                {topic.id}
                                            </div>
                                            <div className="nav__linkitemdetails">
                                                Partitions: {topic.partitionCount}
                                            </div>
                                            <div className="nav__linkitemdetails">
                                                Replication: {topic.replicationFactor}
                                            </div>
                                        </div>
                                    </div>
                                </NavLinkItem>
                            </li>,
                        )}
                    </ul>
                </div>
            </nav>
        );
    }
}
