import * as React from "react";
import * as ReactDOM from "react-dom";

import { MessageComponent } from "./message";
import { EditorComponent } from "./editor";
import { LegacyPreviewComponent } from "./preview";

import { Model, Mode, ConflictResolution } from "../model/model";

export interface IMainProps extends React.Props<void> {
    model: Model;

    onSave: Function;
    onSizeChange: (grow: boolean) => void;
}

export interface IMainState {
}

export class MainComponent extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

        this.state = {};

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
                content = <EditorComponent model={this.props.model} />;
            }
        }

        return <div className="md" onKeyUp={this._onKeyUp}>
            {showToolbar ? <div className="toolbar">
                <span className="bowtie-icon bowtie-edit-outline" title="Edit" onClick={this._toggleToolbar}></span>
                <span className="bowtie-icon bowtie-arrow-up" title="Shrink" onClick={this._shrink}></span>
                <span className="bowtie-icon bowtie-arrow-down" title="Expand" onClick={this._expand}></span>
            </div> : null}
            {content}
        </div>;
    }

    private _onKeyUp = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.key === "s") {
            this.props.onSave();
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

    private _expand = () => {
        this.props.onSizeChange(true);
    }

    private _shrink = () => {
        this.props.onSizeChange(false);
    }
}