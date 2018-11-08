import * as React from "react";
import { ConsumerMessage } from "src/redux/topics";
import StreamTerminal from "./StreamTerminal";

interface StreamProps {
    lines: ConsumerMessage[];
}

class Stream extends React.Component<StreamProps, {}> {
    render() {
        return <div><StreamTerminal lines={this.props.lines} /></div>;
    }
}

export default Stream;
