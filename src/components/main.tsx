import * as React from "react";
import * as ReactDOM from "react-dom";

import { MessageComponent } from "./message";
import { EditorComponent } from "./editor";
import { LegacyPreviewComponent } from "./preview";

import { Model, Mode, ConflictResolution } from "../model/model";

import { UploadsService } from "../services/uploads";

export interface IMainProps extends React.Props<void> {
    model: Model;
    uploads: UploadsService;

    onSave: Function;
    onSizeChange: (grow: boolean) => void;
}

export interface IMainState {
    fullScreen: boolean;
}

export class MainComponent extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

        this.state = {
            fullScreen: false
        };

        this.props.model.addStateListener(() => {
            this.forceUpdate();
        });
    }

    public render(): JSX.Element {
        let content: JSX.Element;
        let showToolbar: boolean = true;

        if (this.props.model.showMessage) {
            content = <MessageComponent model={this.props.model} onCancel={this._messageCancel} onProceed={this._messageProceed} />;
            showToolbar = false;
        } else {
            if (this.props.model.showPreview) {
                content = <LegacyPreviewComponent model={this.props.model} />;
            } else {
                content = <EditorComponent model={this.props.model} uploads={this.props.uploads} />;
            }
        }

        return <div>
            {showToolbar ? <div className="toolbar">
                <span className="bowtie-icon bowtie-edit-outline" title="Edit" onClick={this._toggleToolbar}></span>
                <span className={"bowtie-icon " + (this.state.fullScreen ? "bowtie-view-full-screen-exit" : "bowtie-view-full-screen")} title="Full view" onClick={this._toggleView}></span>
            </div> : null}
            <div className="md" onKeyDown={this._onKeyDown}>
                {content}
            </div>
        </div>;
    }

    private _onKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.key === "s") {
            this.props.onSave();
            event.preventDefault();
            return false;
        }
    }

    private _messageCancel = () => {
        this.props.model.cancelEdit();
    }

    private _messageProceed = (resolution: ConflictResolution) => {
        this.props.model.resolveConflict(resolution);
    };

    private _toggleToolbar = () => {
        if (this.props.model.showPreview) {
            this.props.model.switchToEdit();
        } else {
            this.props.model.switchToPreview();
        }

        this.forceUpdate();
    };

    private _toggleView = () => {
        const newState = !this.state.fullScreen;

        this.setState({
            fullScreen: newState
        });

        this.props.onSizeChange(newState);
    }
}