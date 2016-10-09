import { IWorkItemControlAdapter } from "../adapter";
import { MainStore } from "../store/store";

import { ConflictResolution, SizeMode } from "../model/model";

import { ActionsHub } from "./actions";

export class ActionsCreator {
    constructor(
        private _actionsHub: ActionsHub,
        private _store: MainStore,
        private _adapter: IWorkItemControlAdapter) { }

    public setContentFromWorkItem(content: string) {
        this._actionsHub.setContentFromWorkItem.invoke(content);
    }

    public setMarkdownContent(markdownContent: string) {
        this._actionsHub.setMarkdownContent.invoke(markdownContent);
    }

    public save() {
        this._adapter.save().then(() => {
            // TODO
        });
    }

    public reset() {
        this._actionsHub.reset.invoke(null);
    }

    public toggleState() {
        this._actionsHub.toggleState.invoke(null);
    }

    public toggleSizeMode() {
        this._actionsHub.toggleSizeMode.invoke(null);

        if (this._store.getSizeMode() === SizeMode.Default) {
            this.resize(this._store.getMinHeight(), true);
        }
    }

    public resolveConflict(resolution: ConflictResolution) {

    }

    public upload(fileName: string, filePath: string, file: any) {

    }

    public resize(height: number, force?: boolean) {
        const oldHeight = this._store.getHeight();

        this._actionsHub.resize.invoke(height);

        if (force || oldHeight !== this._store.getHeight()) {
            VSS.resize(null, this._store.getHeight());
        }
    }
}