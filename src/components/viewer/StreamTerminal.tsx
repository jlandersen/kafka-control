import * as React from "react";
import { ConsumerMessage } from "src/redux/topics";

import "./StreamTerminal.css";

interface StreamTerminalProps {
  lines: ConsumerMessage[];
}

class StreamTerminal extends React.Component<StreamTerminalProps, {}> {
  private el: HTMLElement | null = null;

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el!.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const messagesFormatted = this.props.lines.map((l) => (
      <div key={l.id} className="streamterminal__consoletext">
        <span className="streaterminal_consoletext_partition">
        Partition: {l.partition} key: {l.key} offset: {l.offset}
        </span>
        <span className="streaterminal_consoletext_value">{l.value}</span>
    </div>
    ));
    return (
      <div className="streamterminal">
        <div className="streamterminal__console">
          {messagesFormatted}
           <div style={{ float: "left", clear: "both" }} ref={(el) => { this.el = el; }}></div>
        </div>
      </div>
    );
  }
}

export default StreamTerminal;
