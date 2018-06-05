import { Location } from "history";
import queryString from "query-string";
import React from "react";
import { connect, Dispatch, Provider } from "react-redux";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import { ErrorMessage } from "../../models";
import { AppState } from "../../redux";
import { getBrokerCount } from "../../redux/brokers";
import { getTopics, Topic } from "../../redux/topics";
import { ConnectionStatus, registerError, startConnection } from "../../redux/workspace";
import routes from "../../shared/routes";
import Error from "./Error";
import Header from "./Header";
import Nav from "./Nav";

import "./App.css";

interface AppProps {
    connectionStatus: ConnectionStatus;
    isLoading: boolean;
    topics: Topic[];
    errors: ErrorMessage[];
    brokerCount: number;
    location: Location;
}

interface AppDispatchprops {
    actions: {
        onError(error: ErrorMessage): any;
        onStartConnection(brokers: string): any;
    };
}

const mapStateToProps = (state: AppState) => {
    return {
        connectionStatus: state.workspace.connectionStatus,
        isLoading: state.workspace.isLoading,
        errors: state.workspace.errors,
        brokerCount: getBrokerCount(state.brokers),
        topics: getTopics(state.topics),
    };
};

const mapDispatchFromProps = (dispatch: Dispatch) => {
    return {
        actions: {
            onError: bindActionCreators(registerError, dispatch),
            onStartConnection: bindActionCreators(startConnection, dispatch),
        },
    };
};

class App extends React.PureComponent<AppProps & AppDispatchprops, {}> {
    componentDidMount() {
        this.init();
    }

    render() {
        return (
            <div className="container">
                <Header connectionStatus={this.props.connectionStatus} />
                <Nav
                    location={this.props.location}
                    brokerCount={this.props.brokerCount}
                    topics={this.props.topics} />
                <div className="app__content">
                    {this.props.errors.length > 0 && <Error errors={this.props.errors} />}
                    {routes.map((route, index) => {
                        return <Route key={index} path={route.path} exact={route.exact} component={route.component} />;
                    })}
                </div>
            </div>
        );
    }

    private init() {
        // Sets up the connection from the provided list of brokers in ?brokers=..
        const params = queryString.parse(this.props.location.search);
        const brokers = params.brokers;

        if (!brokers) {
            this.props.actions.onError({
                error: "No broker specified",
                message: "Specify a list of brokers to connect with the brokers querystring",
            });
            return;
        }

        this.props.actions.onStartConnection(brokers);
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchFromProps)(App) as any);
