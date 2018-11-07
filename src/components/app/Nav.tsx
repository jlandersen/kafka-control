import { Location } from "history";
import React from "react";
import { FaEllipsisH, FaPlus, FaServer } from "react-icons/fa";

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
                <div className="nav__group">
                    <div className="nav__grouptitle">Cluster</div>
                </div>
                <ul>
                    <li>
                        <NavLinkItem activeClassName="active" path={"/brokers"} location={this.props.location}>
                            <div className="nav__linkitem">
                                <div>
                                    <FaServer color={"#fff"} />
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
                <div className="nav__group">
                    <div className="nav__grouptitle">Topics</div>
                    <div className="nav__groupactions">
                        <NavLinkItem
                            path="/topics/create"
                            location={this.props.location}>
                            <FaPlus className="nav__groupactions__action" />
                        </NavLinkItem>
                    </div>
                </div>
                <div className="nav__topics">
                    <ul>
                        {this.props.topics.map((topic) =>
                            <li key={topic.id}>
                                <NavLinkItem
                                    activeClassName="active"
                                    path={`/topics/view/${topic.id}`}
                                    location={this.props.location}>
                                    <div className="nav__linkitem">
                                        <div>
                                            <FaEllipsisH color={"#fff"} />
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
