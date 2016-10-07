/// <reference path="../declarations.d.ts" />


import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Frame from "react-frame-component";

import { Model, sharedStyles } from "../model/model";

const inlineStyles = require("raw!../assets/vsts-richtext.style");

export interface IPreviewProps {
    model: Model;
}

export class LegacyPreviewComponent extends React.Component<IPreviewProps, void> {
    public render(): JSX.Element {
        return <div className="preview">
            <Frame head={<style type="text/css">{inlineStyles + sharedStyles}</style>}>
                <div className="rendered-markdown" dangerouslySetInnerHTML={{ __html: this.props.model.htmlContent }} />
            </Frame>
        </div>;
    }
}