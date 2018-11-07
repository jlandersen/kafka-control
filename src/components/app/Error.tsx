import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

import { ErrorMessage } from "../../models";

import "./Error.css";

interface ErrorProps {
    errors: ErrorMessage[];
}

export default class Error extends React.PureComponent<ErrorProps> {
    render() {
        const errors = this.props.errors.map((err) =>
            <li>
                <FaExclamationTriangle color={"#7b7b6b"} />
                <i>{this.props.errors[0].error}</i>, {this.props.errors[0].message}
            </li>);

        return (
            <div className="error">
                <ul>
                    {errors}
                </ul>
            </div>
        );
    }
}
