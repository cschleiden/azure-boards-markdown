import * as React from "react";
import * as ReactDOM from "react-dom";

import { Model } from "../model/model";

export interface IEditorProps {
    model: Model;
}

export interface IEditorState {
    value: string;
}

export class EditorComponent extends React.Component<IEditorProps, IEditorState> {
    private _value: string;

    constructor(props: IEditorProps) {
        super(props);

        this.state = {
            value: props.model.markdownContent
        };
    }

    public render(): JSX.Element {
        return <div className="editor">
            <textarea value={this.state.value} onChange={this._onChange}></textarea>
        </div>;
    }

    private _onChange = (event) => {
        this.setState({
            value: event.target.value
        });
        this.props.model.setMarkdown(event.target.value);
    };
}