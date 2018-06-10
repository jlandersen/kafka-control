import { Location } from "history";
import React from "react";
import { Link, Route } from "react-router-dom";

interface NavLinkItemProps {
    path: string;
    activeClassName?: string;
    children?: any;
    location: Location;
}
export default class NavLinkItem extends React.PureComponent<NavLinkItemProps> {
    render() {
        return (
            <Route
                path={this.props.path}
                children={({ match }) => (
                    <Link
                        className={match ? this.props.activeClassName : ""}
                        to={{ pathname: this.props.path, search: this.props.location.search }}>
                        {this.props.children}
                    </Link>
                )} />
        );
    }
}
