import * as Model from "../model/model";

/** Interface for a simple listener to an action firing */
export interface IActionHandler<TPayload> {
    (payload: TPayload): void;
}

let executing = false;

/** Base class for a self dispatched action */
export class Action<TPayload> {
    private _handlers: IActionHandler<TPayload>[] = [];

    public addListener(handler: IActionHandler<TPayload>) {
        this._handlers.push(handler);
    }

    public invoke(payload: TPayload) {
        if (executing) {
            //debugger;
            //throw new Error("Cycle!");
        }

        executing = true;

        for (let handler of this._handlers) {
            handler(payload);
        }

        executing = false;
    }
}

export class ActionsHub {
    public reset = new Action<void>();

    /** Value set by work item */
    public setContentFromWorkItem = new Action<string>();

    public setMarkdownContent = new Action<string>();

    public resolveConflict = new Action<Model.ConflictResolution>();

    public updateSize = new Action<number>();

    public toggleState = new Action<void>();

    public toggleSizeMode = new Action<void>();

    public resize = new Action<number>();
}