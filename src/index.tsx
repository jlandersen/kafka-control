import createBrowserHistory from "history/createBrowserHistory";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import App from "./components/app";
import store from "./redux";
import { selectTopic } from "./redux/topics";

const history = createBrowserHistory();

// Keeps state updated with selected topic in route.
// So far this is enough to avoid adopting connected-react-router.
const topicsSegment = "/topics/";
history.listen((data) => {
    if (!data.pathname.startsWith(topicsSegment)) {
        return;
    }

    store.dispatch(selectTopic(data.pathname.slice(topicsSegment.length)));
});

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById("root"));
