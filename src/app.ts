/// <reference path="../typings/index.d.ts" />

import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { Control } from "./control";

import "style.scss";

var control: Control;

var provider = () => {
    return <ExtensionContracts.IWorkItemNotificationListener>{
        onLoaded: (workItemLoadedArgs: ExtensionContracts.IWorkItemLoadedArgs) => {
            control = new Control();
            VSS.resize(null, 200);
        },
        onFieldChanged: (fieldChangedArgs: ExtensionContracts.IWorkItemFieldChangedArgs) => {
            let changedValue = fieldChangedArgs.changedFields[control.getFieldName()];
            if (changedValue) {
                control.onFieldChange(changedValue);
            }
        },
        onSaved: () => {
            control.onSaved();
        },
        onRefreshed: () => {
            control.onReset();
        },
        onReset: () => {
            control.onReset();
        },
        onUnloaded: () => {
            control.dispose();
        }
    };
};

const context = VSS.getExtensionContext();
VSS.register(`${context.publisherId}.${context.extensionId}.markdown-control`, provider);