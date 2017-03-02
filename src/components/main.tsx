import * as React from "react";
import * as ReactDOM from "react-dom";

import { MessageComponent } from "./message";
import { EditorComponent } from "./editor";
import { PreviewComponent } from "./preview";

import { Mode, SizeMode, ConflictResolution, State, FormatAction } from "../model/model";
import { MainStore } from "../store/store";
import { ActionsCreator } from "../actions/actionsCreators";

import { Uploads } from "../services/uploads";

export interface IMainProps extends React.Props<void> {
    store: MainStore;
    actionsCreator: ActionsCreator;
}

export interface IMainState {
    mode: Mode;
    state: State;

    sizeMode: SizeMode;
    canGrow: boolean;

    markdownContent: string;
    htmlContent: string;

    selection: [number, number];

    showProgress: boolean;
}

export class MainComponent extends React.Component<IMainProps, IMainState> {
    private _editor: EditorComponent;
    private _resolveEditor = (editor) => this._editor = editor;

    constructor(props: IMainProps) {
        super(props);

        this.state = this._getStateFromStore();

        this.props.store.addListener(this._storeChangedHandler);
    }

    public componentWillUnmount() {
        this.props.store.removeListener(this._storeChangedHandler);
    }

    private _storeChangedHandler = () => {
        this.setState(this._getStateFromStore());
    }

    private _getStateFromStore(): IMainState {
        return {
            mode: this.props.store.getMode(),
            sizeMode: this.props.store.getSizeMode(),
            canGrow: this.props.store.canGrow(),
            state: this.props.store.getState(),
            markdownContent: this.props.store.getMarkdown(),
            htmlContent: this.props.store.getHtmlContent(),
            selection: this.props.store.getSelection(),
            showProgress: this.props.store.getProgress()
        };
    }

    public render(): JSX.Element {
        let showToolbar: boolean = true;

        let content: JSX.Element;
        switch (this.state.state) {

            case State.Message:
                content = <MessageComponent mode={this.state.mode} onCancel={this._messageCancel} onProceed={this._messageProceed} />;
                showToolbar = false;
                break;

            case State.Preview:
                content = <PreviewComponent actionsCreator={this.props.actionsCreator} htmlContent={this.state.htmlContent} sizeMode={this.state.sizeMode} />;
                break;

            case State.Editor:
                content = <EditorComponent
                    actionsCreator={this.props.actionsCreator}
                    markdownContent={this.state.markdownContent}
                    sizeMode={this.state.sizeMode}
                    canGrow={this.state.canGrow}
                    selection={this.state.selection}
                    ref={this._resolveEditor} />;
                break;
        }

        let toolbar: JSX.Element = null;
        if (showToolbar) {
            let editorToolbar: JSX.Element[] = null;

            if (this.state.state === State.Editor) {
                editorToolbar = [
                    <span key="bold" className="bowtie-icon bowtie-format-bold" title="Bold [Ctrl + B]" onClick={() => this._onFormatting(FormatAction.Bold)}></span>,
                    <span key="italic" className="bowtie-icon bowtie-format-italic" title="Italic [Ctrl + I]" onClick={() => this._onFormatting(FormatAction.Italic)}></span>,
                    <span key="image" className="bowtie-icon bowtie-image" title="Insert image" onClick={this._insertImage}></span>
                ]
            }

            toolbar = <div className="toolbar">
                {editorToolbar}

                <span className="right bowtie-icon bowtie-view-full-screen" title="Open full screen reading mode" onClick={this._openFullscreen}></span>
                <span className={"right bowtie-icon " + (this.state.sizeMode === SizeMode.AutoGrow ? "bowtie-fold-less" : "bowtie-fold-more")} title={this.state.sizeMode === SizeMode.AutoGrow ? "Disable auto size" : "Enable auto size"} onClick={this._toggleAutoGrow}></span>
                <span className={"right bowtie-icon " + (this.state.state === State.Preview ? "bowtie-edit-outline" : "bowtie-file-preview")} title={(this.state.state === State.Preview ? "Preview [Ctrl + Shift + V]" : "Edit")} onClick={this._toggleEditMode}></span>
            </div>;
        }

        let progress: JSX.Element;
        if (this.state.showProgress) {
            progress = <div className="spinner">Working...</div>;
        }

        return <div>
            {toolbar}
            <div className="md" onKeyDown={this._onKeyDown} tabIndex={0}>
                {content}
            </div>
            {progress}
        </div>;
    }

    private _onFormatting = (formatAction: FormatAction) => {
        this.props.actionsCreator.applyFormatting(formatAction);
    };

    private _onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.ctrlKey) {
            let handled = false;

            switch (event.key.toLowerCase()) {
                case "b":
                    this.props.actionsCreator.applyFormatting(FormatAction.Bold);
                    handled = true;
                    break;

                case "i":
                    this.props.actionsCreator.applyFormatting(FormatAction.Italic);
                    handled = true;
                    break;

                case "s":
                    this.props.actionsCreator.save();
                    handled = true;
                    break;

                case "v":
                    if (event.shiftKey) {
                        this.props.actionsCreator.toggleState();
                        handled = true;
                    }
                    break;
            }

            if (handled) {
                event.preventDefault();
                return false;
            }
        }
    }

    private _messageCancel = () => {
        this.props.actionsCreator.resolveConflict(ConflictResolution.Cancel);
    }

    private _messageProceed = (resolution: ConflictResolution) => {
        this.props.actionsCreator.resolveConflict(resolution);
    };

    private _toggleEditMode = () => {
        this.props.actionsCreator.toggleState();
    };

    private _toggleAutoGrow = () => {
        this.props.actionsCreator.toggleSizeMode();
    }

    private _insertImage = () => {
        if (this._editor) {
            this._editor.openFileSelector();
        }
    }

    private _openFullscreen = () => {
        this.props.actionsCreator.openFullscreen();
    }
}