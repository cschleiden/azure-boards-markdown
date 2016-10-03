/// <reference path="../../typings/index.d.ts" />

import * as VSSService from "VSS/Service";
import * as WitClient from "TFS/WorkItemTracking/RestClient";
import * as WitContracts from "TFS/WorkItemTracking/Contracts";
import * as WitService from "TFS/WorkItemTracking/Services";
import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";

export class UploadsService {
    private _client: WitClient.WorkItemTrackingHttpClient2_3;

    private _workItemId: number;
    private _attachmentsToReference: string[] = [];

    constructor() {
        this._client = WitClient.getClient();
    }

    public startUpload(name: string, path: string, content: any): IPromise<string> {
        return this._client.createAttachment(content, name).then(attachmentReference => {
            this._attachmentsToReference.push(attachmentReference.url);
            
            return attachmentReference.url;
        });
    }

    public setWorkItemId(id: number) {
        if (this._workItemId !== id) {
            this._attachmentsToReference = [];
        }

        this._workItemId = id;
    }

    public referenceAttachments(): IPromise<void> {
        let ops = this._attachmentsToReference.map(ref => ({
            "op": "add",
            "path": "/relations/-",
            "value": {
                "rel": "AttachedFile",
                "url": ref,
                "attributes": {
                    "comment": "Markdown attachment"
                }
            }
        }));

        return this._client.updateWorkItem(ops, this._workItemId).then<void>(() => {
            this._attachmentsToReference = [];
        });
    }
}