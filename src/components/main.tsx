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
}

export interface IMainState {
}

export class MainComponent extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

        this.state = {
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
                <span className={"right bowtie-icon " + (this.props.model.autoGrow ? "bowtie-view-full-screen-exit" : "bowtie-view-full-screen")} title="Toggle auto grow" onClick={this._toggleAutoGrow}></span>
                <span className={"right bowtie-icon " + (this.props.model.showPreview ? "bowtie-edit-outline" : "bowtie-file-preview")} title={(this.props.model.showPreview ? "Preview" : "Edit")} onClick={this._toggleEditMode}></span>
            </div> : null}
            <div className="md" onKeyDown={this._onKeyDown} tabindex="0">
                {content}
            </div>
        </div>;
    }

    private _onKeyDown = (event: React.KeyboardEvent) => {
        if (event.ctrlKey) {
            if (event.key === "s") {
                this.props.onSave();
                event.preventDefault();
                return false;
            }

            if (event.shiftKey && event.key.toLowerCase() === "v") {
                this._toggleEditMode();
                event.preventDefault();
                return false;
            }
        }
    }

    private _messageCancel = () => {
        this.props.model.cancelEdit();
    }

    private _messageProceed = (resolution: ConflictResolution) => {
        this.props.model.resolveConflict(resolution);
    };

    private _toggleEditMode = () => {
        if (this.props.model.showPreview) {
            this.props.model.switchToEdit();
        } else {
            this.props.model.switchToPreview();
        }

        this.forceUpdate();
    };

    private _toggleAutoGrow = () => {
        this.props.model.toggleAutoGrow();
    }
}