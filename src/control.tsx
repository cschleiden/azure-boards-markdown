/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as VSSService from "VSS/Service";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { MainComponent } from "./components/main"

import { Model } from "./model/model";

export class Control {
    private _witService: WitService.IWorkItemFormService;

    private _model: Model = new Model();

    constructor() {
        // Cache service instance
        WitService.WorkItemFormService.getService().then(service => {
            this._witService = service;
            this._updateFromWorkItem();
        })

        this._model.addListener(() => this._onModelChange());

        this._render();
    }

    private _onModelChange() {
        if (this._witService) {
            this._witService.setFieldValue(this.getFieldName(), this._model.getOutput());
        }
    }

    public update(value: string) {

    }

    public getFieldName(): string {
        return "System.Description";
    }

    private _updateFromWorkItem() {
        this._witService.getFieldValue(this.getFieldName()).then(value => {
            this._model.setInput(value as string);
            this._render();
        });
    }

    private _render() {
        let element = document.getElementById("content");
        ReactDOM.render(<MainComponent model={this._model} />, element);
    }
}