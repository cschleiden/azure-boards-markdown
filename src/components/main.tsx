import * as React from "react";
import * as ReactDOM from "react-dom";

import { MessageComponent } from "./message";
import { EditorComponent } from "./editor";
import { PreviewComponent } from "./preview";

import { Mode, SizeMode, ConflictResolution, State } from "../model/model";
import { MainStore } from "../store/store";
import { ActionsCreator } from "../actions/actionsCreators";

import { UploadsService } from "../services/uploads";

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
}

export class MainComponent extends React.Component<IMainProps, IMainState> {
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
            htmlContent: this.props.store.getHtmlContent()
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
                    canGrow={this.state.canGrow} />;
                break;
        }

        return <div>
            {showToolbar ? <div className="toolbar">
                <span className="bowtie-icon bowtie-format-bold" title="Bold"></span>

                <span className={"right bowtie-icon " + (this.state.sizeMode === SizeMode.AutoGrow ? "bowtie-fold-less" : "bowtie-fold-more")} title="Toggle auto grow" onClick={this._toggleAutoGrow}></span>
                <span className={"right bowtie-icon " + (this.state.state === State.Preview ? "bowtie-edit-outline" : "bowtie-file-preview")} title={(this.state.state === State.Preview ? "Preview" : "Edit")} onClick={this._toggleEditMode}></span>
            </div> : null}
            <div className="md" onKeyDown={this._onKeyDown} tabindex="0">
                {content}
            </div>
        </div>;
    }

    private _onKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey) {
            if (event.key === "s") {
                this.props.actionsCreator.save();

                event.preventDefault();
                return false;
            }

            if (event.shiftKey && event.key.toLowerCase() === "v") {
                this.props.actionsCreator.toggleState();

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
}