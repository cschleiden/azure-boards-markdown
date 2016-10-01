import * as React from "react";
import * as ReactDOM from "react-dom";

import { Model, Mode, ConflictResolution } from "../model/model";

export interface IMessageProps {
    model: Model;
    onCancel: () => void;
    onProceed: (result: ConflictResolution) => void;
}

export class MessageComponent extends React.Component<IMessageProps, void> {
    private _value: string;

    constructor(props: IMessageProps) {
        super(props);
    }

    public render(): JSX.Element {
        let message: string;
        let buttons: ConflictResolution[];


        switch (this.props.model.mode) {
            case Mode.Legacy:
                message = "This field has been set using the legacy HTML editor. We will need to convert it to markdown. It will be a best-effort conversion and might not succeed in all cases.";
                buttons = [ConflictResolution.Convert];
                break;

            case Mode.MarkdownModified:
                message = "It appears like the content of this field has been modified using the legacy HTML editor. To continue we will need to either convert or ignore the changes."
                buttons = [ConflictResolution.Ignore, ConflictResolution.Convert];
                break;
        }

        return <div className="message">
            <div className="close" onClick={this._onClose}>
                <span className="bowtie-icon bowtie-navigate-close"></span>
            </div>
            <p><b>Warning</b></p>
            <div className="text">{message}</div>
            <div className="buttons">
                {buttons.map((result, index) => <button className={ index === 0 ? "cta" : "" } key={result} onClick={() => this.props.onProceed(result)}>{ConflictResolution[result]}</button>)}
            </div>
        </div>;
    }

    private _onClose = () => {
        this.props.onCancel();
    }
}