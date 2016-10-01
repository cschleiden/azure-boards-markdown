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
    private _ignoreIncomingChange = false;

    constructor() {
        // Cache service instance
        WitService.WorkItemFormService.getService().then(service => {
            this._witService = service;
            this._updateFromWorkItem();
        })

        this._model.addDataListener(() => this._onModelChange());

        this._render();
    }

    public dispose() {
        let element = document.getElementById("content");
        ReactDOM.unmountComponentAtNode(element);
    }

    /** Triggered when a change is triggered by the editor */
    private _onModelChange() {
        if (this._witService) {
            this._ignoreIncomingChange = true;

            this._witService.setFieldValue(this.getFieldName(), this._model.getOutput()).then(() => {
                this._ignoreIncomingChange = false;
            })
        }
    }

    /** Triggered when work item is saved */
    public onSaved() {
        this._updateFromWorkItem();
    }

    /** Triggered when work item is refreshed or reset */
    public onReset() {
        this._updateFromWorkItem();
    }

    /** Triggered when field value on work item changes */
    public onFieldChange(value: string, lifeCycleEvent?: boolean) {
        if (!this._ignoreIncomingChange) {
            this._model.setInput(value, lifeCycleEvent);
        }
    }

    /** Get value from work item and update editor */
    private _updateFromWorkItem() {
        this._witService.getFieldValue(this.getFieldName()).then(value => {
            this.onFieldChange(value as string, true);
        });
    }

    public getFieldName(): string {
        return "System.Description";
    }

    private _render() {
        let element = document.getElementById("content");
        ReactDOM.render(<MainComponent model={this._model} />, element);
    }
}