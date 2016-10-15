/// <reference path="../typings/index.d.ts" />

import * as Q from "q";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as VSSService from "VSS/Service";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as WitContracts from "TFS/WorkItemTracking/Contracts";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { throttle } from "utils/throttle";

import { IWorkItemControlAdapter } from "./adapter";

import { MainComponent } from "./components/main"

import { Uploads } from "./services/uploads"

import { MainStore, IStoreListener } from "./store/store";
import { ActionsHub, IActionHandler } from "./actions/actions";
import { ActionsCreator } from "./actions/actionsCreators";
import { SizeMode } from "./model/model";

export class Control implements ExtensionContracts.IWorkItemNotificationListener, IWorkItemControlAdapter {
    private _witService: WitService.IWorkItemFormService;
    private _dataService: IExtensionDataService;

    private _store: MainStore;
    private _actionsCreator: ActionsCreator;

    constructor() {
        this._loadSettings();

        const config = VSS.getConfiguration();

        const fieldName = config.witInputs["FieldName"];
        const minHeight = Number(config.witInputs["height"]) || config.defaultHeight;
        const maxHeight = Number(config.witInputs["fullHeight"]) || 500;

        let throttledSave = throttle(500, (output: string) => {
            this._witService.setFieldValue(this._store.getFieldName(), output);
            console.log("Saving - Saved");
        }, false);

        const actionsHub = new ActionsHub();
        this._store = new MainStore(actionsHub, fieldName, minHeight, maxHeight, throttledSave, () => {
            this._storeSettings();
        });

        this._actionsCreator = new ActionsCreator(actionsHub, this._store, this, new Uploads());

        actionsHub.openFullscreen.addListener(this._openFullscreen.bind(this));
    }

    private _loadSettings() {
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: IExtensionDataService) => {
            this._dataService = dataService;

            this._dataService.getValue<string>("SizeMode", {
                scopeType: "User",
                defaultValue: SizeMode[SizeMode.Default]
            }).then(sizeMode => {
                let storedSizeMode = SizeMode[sizeMode];
                this._actionsCreator.setSizeMode(storedSizeMode);
            });
        })
    }

    private _storeSettings() {
        this._dataService.setValue("SizeMode", SizeMode[this._store.getSizeMode()], {
            scopeType: "User"
        })
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
        /*let changedValue = fieldChangedArgs.changedFields[this._store.getFieldName()];
        if (changedValue) {
            if (changedValue === this._lastIncomingValue) {
                console.log("Incoming Change - Discarded, same as last incoming value");
                return;
            }

            if (changedValue === this._lastSetValue) {
                console.log("Incoming Change - Discarded, same as last set value");
                return;
            }

            console.log("Incoming Change - Accepted");

            this._lastIncomingValue = changedValue;
            this._changeField(changedValue);
        }*/
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

    private _openFullscreen(htmlContent: string) {
        const context = VSS.getExtensionContext();

        Q.all([
            this._witService.getFields(), VSS.getService(VSS.ServiceIds.Dialog)])
            .spread((fields: WitContracts.WorkItemField[], dialogService: IHostDialogService) => {
                let matchingFields = fields.filter(f => f.referenceName === this._store.getFieldName());

                dialogService.openDialog(
                    `${context.publisherId}.${context.extensionId}.fullscreenView`,
                    {      
                        modal: true,
                        width: 30000,
                        height: 30000,
                        buttons: [],
                        title: matchingFields && matchingFields.length > 0 && matchingFields[0].name || "",
                        draggable: false,
                        resizable: true                        
                    },
                    {
                        "htmlContent": htmlContent
                    });
            });
    }
}