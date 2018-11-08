import * as React from "react";
import { ConsumerMessage } from "src/redux/topics";
import StreamTerminal from "./StreamTerminal";

interface StreamProps {
    lines: ConsumerMessage[];
    isVisible: boolean;
}

class Stream extends React.Component<StreamProps, {}> {
    render() {
        return <div className={this.props.isVisible ? "fadeIn" : "fadeOut"}>
            <StreamTerminal lines={this.props.lines} />
            </div>;
    }
}

export default Stream;
