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
    private _resolveContent = (element: HTMLElement) => this._content = element;
    private _content: HTMLElement;

    public render(): JSX.Element {
        return <div className="preview">
            <Frame head={<style type="text/css">{inlineStyles + sharedStyles}</style>} contentDidMount={this._componentDidMount} contentDidUpdate={this._componentDidMount}>
                <div className="rendered-markdown" dangerouslySetInnerHTML={{ __html: this.props.model.htmlContent }} ref={this._resolveContent} />
            </Frame>
        </div>;
    }

    private _componentDidMount = () => {
        if (this._content) {
            let finishedCount = 0;

            let $images = $(this._content).find("img");
            let delayedImages = $images.toArray().filter((img: HTMLImageElement) => !img.complete);
            let delayedCount = delayedImages.length;

            delayedImages.forEach((img) => {
                $(img).on("load", () => {
                    $(img).off("load");
                    if (++finishedCount === delayedCount) {
                        this._sizeChange();
                    }
                });
            });
        }
    }

    private _sizeChange() {
        const height = this._content.scrollHeight;
        console.log("size change" + height);

        this.props.model.setHeight(height);
    }
}