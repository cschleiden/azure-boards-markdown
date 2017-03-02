import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

import { Control } from "./control";

import "style.scss";

var provider = () => {
    return new Control();
};

const context = VSS.getExtensionContext();
VSS.register(`${context.publisherId}.${context.extensionId}.markdown-control`, provider);