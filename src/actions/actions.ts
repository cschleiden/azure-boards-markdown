import * as Model from "../model/model";

/** Interface for a simple listener to an action firing */
export interface IActionHandler<TPayload> {
    (payload: TPayload): void;
}

let executing = false;

/** Base class for a self dispatched action */
export class Action<TPayload> {
    private _handlers: IActionHandler<TPayload>[] = [];

    constructor(private _name: string) { }

    public addListener(handler: IActionHandler<TPayload>) {
        this._handlers.push(handler);
    }

    public invoke(payload: TPayload) {
        console.log("Action " + this._name); 

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

export interface ISelectionChangePayload {
    selectionStart: number;
    selectionEnd: number;
}

export class ActionsHub {
    public reset = new Action<void>("reset");

    /** Value set by work item */
    public setContentFromWorkItem = new Action<string>("setContentFromWorkItem");

    public setMarkdownContent = new Action<string>("setMarkdownContent");

    public resolveConflict = new Action<Model.ConflictResolution>("resolveConflict");

    public updateSize = new Action<number>("updateSize");

    public toggleState = new Action<void>("toggleState");

    public setSizeMode = new Action<Model.SizeMode>("setSizeMode");
    public toggleSizeMode = new Action<void>("toggleSizeMode");
    
    public resize = new Action<number>("resize");

    public setProgress = new Action<boolean>("setProgress");

    /** Change selection in editor */
    public changeSelection = new Action<ISelectionChangePayload>("changeSelection");

    /** Insert token at current editor position */
    public insertToken = new Action<string>("insertToken");    
}