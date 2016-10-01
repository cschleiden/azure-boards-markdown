/// <reference path="../typings/index.d.ts" />

import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { Control } from "./control";

import "style.scss";

var control: Control;

var provider = () => {
    return {
        onLoaded: (workItemLoadedArgs: ExtensionContracts.IWorkItemLoadedArgs) => {
            control = new Control()
        },
        onFieldChanged: (fieldChangedArgs: ExtensionContracts.IWorkItemFieldChangedArgs) => {
            let changedValue = fieldChangedArgs.changedFields[control.getFieldName()];
            if (changedValue) {
                control.update(changedValue);
            }
        }  
    };
};

const context = VSS.getExtensionContext();
VSS.register(`${context.publisherId}.${context.extensionId}.markdown-control`, provider);