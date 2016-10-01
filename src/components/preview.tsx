/// <reference path="../declarations.d.ts" />


import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Frame from "react-frame-component";

import { Model, sharedStyles } from "../model/model";

export interface IPreviewProps {
    model: Model;
}

export class LegacyPreviewComponent extends React.Component<IPreviewProps, void> {
    public render(): JSX.Element {
        return <div className="preview">
            <Frame head={<style type="text/css">{inlineStyles + sharedStyles}</style>}>
                <div dangerouslySetInnerHTML={{ __html: this.props.model.htmlContent }} />
            </Frame>
        </div>;
    }
}

const inlineStyles = `P,body,h1,h2,h3,h4,h5,h6{margin:0}body,html{height:100%;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box}body{font-family:Segoe UI,Helvetica Neue,Helvetica,Arial,Verdana;color:#222;background-color:#fff;font-size:75%;word-break:break-word;padding:5px}body.invalid{background-color:#ffc}body.watermark{color:#999;font-style:italic}P{line-height:1.5em}a,a:visited{color:#007acc}`;