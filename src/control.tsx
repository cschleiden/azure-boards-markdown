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

    private _minHeight: number;
    private _maxHeight: number;
    private _fieldName: string;

    constructor() {
        const config = VSS.getConfiguration();
        this._fieldName = config.witInputs["FieldName"];
        this._minHeight = Number(config.witInputs["height"]) || config.defaultHeight;
        this._maxHeight = Number(config.witInputs["fullHeight"]) || 500;

        this._model.addDataListener(() => this._onModelChange());
        this._model.addStateListener(() => this._onModelStateChange());

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
            });
        }
    }

    /** Triggered when non-data changes are triggered in editor */
    private _onModelStateChange() {
        this._updateSize();
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

        this._updateSize();
    }

    /** Get value from work item and update editor */
    private _updateFromWorkItem() {
        this._witService.getFieldValue(this.getFieldName()).then(value => {
            this.onFieldChange(value as string, true);
        });
    }

    public getFieldName(): string {
        return this._fieldName;
    }

    private _render() {
        let element = document.getElementById("content");
        ReactDOM.render(<MainComponent model={this._model} uploads={this._uploadsService} onSave={this._onSave} />, element);
    }

    private _onSave = () => {
        if (this._witService) {
            this._witService.beginSaveWorkItem($.noop, $.noop);
        }
    }

    private lastHeight: number = null;

    private _updateSize() {
        if (!this._model.showMessage) {
            let newHeight: number;

            if (this._model.autoGrow) {
                newHeight = this._model.getDesiredHeight();

                if (newHeight === null) {
                    // Height not yet available, schedule for next tick
                    setTimeout(() => this._updateSize(), 0);
                    return;
                }

                // Clamp
                newHeight = Math.min(this._maxHeight, Math.max(this._minHeight, newHeight));
            } else {
                newHeight = this._minHeight;
            }

            if (newHeight && newHeight !== this.lastHeight) {
                VSS.resize(null, newHeight);
            }

            this.lastHeight = newHeight;
        }
    }
}