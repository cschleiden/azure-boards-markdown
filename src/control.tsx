/// <reference path="../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as VSSService from "VSS/Service";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { MainComponent } from "./components/main"

import { Model } from "./model/model";
import { UploadsService } from "./services/uploads";

export class Control implements ExtensionContracts.IWorkItemNotificationListener {
    private _witService: WitService.IWorkItemFormService;
    private _uploadsService: UploadsService = new UploadsService();

    private _model: Model = new Model();
    private _ignoreIncomingChange = false;

    private _height: number;
    private _fullHeight: number;
    private _fieldName: string;

    constructor() {
        const config = VSS.getConfiguration();
        this._fieldName = config.witInputs["FieldName"];
        this._height = Number(config.witInputs["height"]) || config.defaultHeight;
        this._fullHeight = Number(config.witInputs["fullHeight"]) || 500;

        this._model.addDataListener(() => this._onModelChange());
        
        // TODO
        this._model.setBlock(false);
    }

    public onLoaded() {
        let cont = () => {
            this._updateFromWorkItem();
            this._render();
        }

        if (this._witService) {
            cont();
        } else {
            WitService.WorkItemFormService.getService().then(service => {
                this._witService = service;
                cont();
            });
        }
    }

    public onUnloaded() {
        let element = document.getElementById("content");
        ReactDOM.unmountComponentAtNode(element);
    }

    public onFieldChanged(fieldChangedArgs: ExtensionContracts.IWorkItemFieldChangedArgs) {
        let changedValue = fieldChangedArgs.changedFields[this.getFieldName()];
        if (changedValue) {
            this.onFieldChange(changedValue);
        }
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

    public onRefreshed() {
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
        ReactDOM.render(<MainComponent model={this._model} uploads={this._uploadsService} onSave={this._onSave} onSizeChange={this._toggleHeight} />, element);
    }

    private _onSave = () => {
        if (this._witService) {
            this._witService.beginSaveWorkItem($.noop, $.noop);
        }
    }

    private _toggleHeight = (full: boolean) => {
        VSS.resize(null, full ? this._fullHeight : this._height);
    }
}