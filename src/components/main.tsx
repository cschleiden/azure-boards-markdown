import * as React from "react";
import * as ReactDOM from "react-dom";

import { EditorComponent } from "./editor";
import { LegacyPreviewComponent } from "./preview";

import { Model } from "../model/model";

export interface IMainProps extends React.Props<void> {
    model: Model;
}

export interface IMainState {
    isPreview: boolean;
}

export class MainComponent extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

        this.state = {
            isPreview: true
        };
    }

    public render(): JSX.Element {
        let content: JSX.Element;

        if (this.state.isPreview) {
            content = <LegacyPreviewComponent model={ this.props.model } />;
        } else {
            content = <EditorComponent model={ this.props.model } />;
        }

        return <div className="md">
            <div className="toolbar">
                <span className="bowtie-icon bowtie-edit" onClick={ this._toggleToolbar }></span>
            </div>
            {content}
        </div>;
    }

    private _toggleToolbar = () => {
        this.setState({
            isPreview: !this.state.isPreview
        });
    };
}