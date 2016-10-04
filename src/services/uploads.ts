/// <reference path="../../typings/index.d.ts" />

import * as VSSService from "VSS/Service";
import * as WitClient from "TFS/WorkItemTracking/RestClient";
import * as WitContracts from "TFS/WorkItemTracking/Contracts";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

export class UploadsService {
    private _client: WitClient.WorkItemTrackingHttpClient2_3;

    constructor() {
        this._client = WitClient.getClient();
    }

    public startUpload(name: string, path: string, content: any): IPromise<string> {
        return this._client.createAttachment(content, name).then(attachmentReference => {
            return attachmentReference.url;
        });
    }
}