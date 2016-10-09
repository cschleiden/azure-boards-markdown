/// <reference path="../typings/index.d.ts" />

import * as Q from "q";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as VSSService from "VSS/Service";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { IWorkItemControlAdapter } from "./adapter";
import { throttle } from "./utils/throttle";

import { MainComponent } from "./components/main"

import { MainStore, IStoreListener } from "./store/store";
import { ActionsHub } from "./actions/actions";
import { ActionsCreator } from "./actions/actionsCreators";

export class Control implements ExtensionContracts.IWorkItemNotificationListener, IWorkItemControlAdapter {
    private _witService: WitService.IWorkItemFormService;

    private _store: MainStore;
    private _actionsCreator: ActionsCreator;

    private _originalValue: string;

    constructor() {
        const config = VSS.getConfiguration();

        const fieldName = config.witInputs["FieldName"];
        const minHeight = Number(config.witInputs["height"]) || config.defaultHeight;
        const maxHeight = Number(config.witInputs["fullHeight"]) || 500;

        const actionsHub = new ActionsHub();
        this._store = new MainStore(actionsHub, fieldName, minHeight, maxHeight);
        this._store.addListener(throttle(200, this._onStoreChanged.bind(this)) as IStoreListener);

        this._actionsCreator = new ActionsCreator(actionsHub, this._store, this);
    }

    private _lastFieldValue: string;

    private _onStoreChanged() {
        if (this._witService) {
            let newValue = this._store.getOutput();
            if (newValue === this._lastFieldValue) {
                return;
            }

            this._lastFieldValue = newValue;

            if (!this._store.isChanged()) {
                newValue = this._originalValue;
            }

            this._witService.setFieldValue(this._store.getFieldName(), newValue);            
        }
    }

    public onLoaded() {
        let cont = () => {
            this._reset();
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
        let changedValue = fieldChangedArgs.changedFields[this._store.getFieldName()];
        if (changedValue && changedValue !== this._originalValue) {
            this._changeField(changedValue);
        }
    }

    /** Triggered when work item is saved */
    public onSaved() {
        this._reset();
    }

    public onRefreshed() {
        this._reset();
    }

    /** Triggered when work item is refreshed or reset */
    public onReset() {
        this._reset();
    }

    /** Triggered when field value on work item changes */
    private _changeField(value: string) {
        this._actionsCreator.setContentFromWorkItem(value);
    }

    /** Get value from work item and update editor */
    private _reset() {
        this._witService.getFieldValue(this._store.getFieldName()).then(value => {
            this._originalValue = value as string;
            this._changeField(value as string);
            this._actionsCreator.reset();
        });
    }

    private _render() {
        let element = document.getElementById("content");
        ReactDOM.render(<MainComponent store={this._store} actionsCreator={this._actionsCreator} />, element);
    }

    public save(): IPromise<void> {
        if (this._witService) {
            return Q.Promise<void>((resolve, reject) => {
                this._witService.beginSaveWorkItem(() => resolve(null), () => reject(null));
            });
        }
    }
}