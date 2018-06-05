import React from "react";

interface RecordItemProps {
    value: string;
}

export default class RecordItem extends React.PureComponent<RecordItemProps, {}> {
    render() {
        return (<li>{this.props.value}</li>);
    }
}
