import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Dropzone from "react-dropzone";
import { Model } from "../model/model";
import { UploadsService } from "../services/uploads";

export interface IEditorProps {
    model: Model;
    uploads: UploadsService;
}

export interface IEditorState {
    value: string;
}

function getImageToken(name: string, path: string): string {
    return `![${name}](${path}})`;
}

export class EditorComponent extends React.Component<IEditorProps, IEditorState> {
    private _value: string;

    private _textarea: HTMLTextAreaElement;
    private _resolveTextarea = (el: HTMLTextAreaElement) => {
        this._textarea = el;
    }

    constructor(props: IEditorProps) {
        super(props);

        this.state = {
            value: props.model.markdownContent
        };
    }

    public render(): JSX.Element {
        return <div className="editor">
            <Dropzone onDrop={this._onDrop} disableClick={true} disablePreview={true} style={{}}>
                <textarea value={this.state.value} onChange={this._onChange} ref={this._resolveTextarea}></textarea>
            </Dropzone>
        </div>;
    }

    private _onDrop = (files) => {
        let tokens: string[] = [];
        for (let file of files) {
            this.props.uploads.startUpload(file.name, file.path, file).then(url => {
                this._addTextAtCursor("\n" + getImageToken(file.name, url) + "\n");
            });
        }
    }

    private _addTextAtCursor(text: string) {
        let idx = this._textarea.selectionStart;

        let val = this.state.value;
        let v2 = val.substr(0, idx) + text + val.substr(idx);

        this.setState({
            value: v2
        }, () => {
            // Restore cursor position
            this._textarea.setSelectionRange(idx, idx);
        });
    }

    private _onChange = (event) => {
        this.setState({
            value: event.target.value
        });
        this.props.model.setMarkdown(event.target.value);
    };
}