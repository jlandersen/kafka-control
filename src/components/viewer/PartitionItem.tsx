import * as React from "react";
import { FaCheckCircle, FaExclamationCircle, FaHdd } from "react-icons/fa";
import { TopicPartition } from "src/redux/topics";

import "./PartitionItem.css";

interface PartitionItemProps {
  partition: TopicPartition;
}

export default class PartitionItem extends React.PureComponent<
  PartitionItemProps
> {
  render() {
    return (
      <div className="partitionitem">
        <div>
          <FaHdd color={"#000"} size={15} />
          &nbsp;
          <span className="partitionitem__partitionid">
            Partition {this.props.partition.partition}
          </span>
        </div>
        <div>Leader: {this.props.partition.leader}</div>
        <div>
            ISR: {this.props.partition.isr.join(",")}
                { this.props.partition.replicas.length === this.props.partition.isr.length
                    && <FaCheckCircle color={"#000"} size={15} /> }

                { this.props.partition.replicas.length !== this.props.partition.isr.length
                && <FaExclamationCircle color={"#B53735"} size={15} /> }
        </div>
        <div>Replicas: {this.props.partition.replicas.join(",")}</div>
      </div>
    );
  }
}
