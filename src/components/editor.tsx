import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Dropzone from "react-dropzone";

import { ActionsCreator } from "../actions/actionsCreators";
import { UploadsService } from "../services/uploads";
import { SizeMode } from "../model/model";

export interface IEditorProps {
    actionsCreator: ActionsCreator;

    markdownContent: string;
    sizeMode: SizeMode;
    canGrow: boolean;
}

export interface IEditorState {
}

function getImageToken(name: string, path: string): string {
    return `![${name}](${path})`;
}

const heightAdjustmentInPx = 20;

export class EditorComponent extends React.Component<IEditorProps, IEditorState> {
    private _value: string;

    private _textarea: HTMLTextAreaElement;
    private _resolveTextarea = (el: HTMLTextAreaElement) => {
        this._textarea = el;
    }

    constructor(props: IEditorProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        let textAreaStyle: React.CSSProperties = {};

        /*if (this.props.canGrow) {
            textAreaStyle.height = `calc(100% - ${heightAdjustmentInPx}px)`;
        } else {
            textAreaStyle.height = "100%";
        }*/

        return <div className="editor">
            <Dropzone onDrop={this._onDrop} disableClick={true} disablePreview={true} style={{}}>
                <textarea
                    style={textAreaStyle}
                    value={this.props.markdownContent}
                    onChange={this._onChange}
                    onSelect={this._onSelect}
                    onPaste={this._onPaste}
                    ref={this._resolveTextarea}></textarea>
            </Dropzone>
        </div>;
    }

    public componentDidMount() {
        this._onSizeChange();
    }

    public componentWillReceiveProps(nextProps: IEditorProps) {
        if (this.props.sizeMode !== nextProps.sizeMode && nextProps.sizeMode === SizeMode.AutoGrow) {
            this._onSizeChange(true);
        }
    }

    private _onDrop = (files) => {
        let tokens: string[] = [];
        for (let file of files) {
            this.props.actionsCreator.upload(file.name, file.path, file);

            /*.then(url => {
                this._addTextAtCursor("\n" + getImageToken(file.name, url) + "\n");
            });*/
        }
    }
    /*
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
        }*/

    private _onSizeChange(force?: boolean) {
        if (force || this.props.sizeMode === SizeMode.AutoGrow) {
            if (this._textarea) {
                // To force the textarea to resize, set height to auto, let it resize, grab scrollheight, and then back
                // to default
                const oldHeight = this._textarea.style.height;
                this._textarea.style.height = "auto";
                const scrollHeight = this._textarea.scrollHeight + heightAdjustmentInPx;
                this._textarea.style.height = oldHeight;                

                this.props.actionsCreator.resize(scrollHeight);
            }
        }
    }

    private _onChange = (event) => {
        this.props.actionsCreator.setMarkdownContent(event.target.value);

        this._onSizeChange();
    };

    private _onSelect = () => {

    }

    private _onPaste = () => {

    }
}