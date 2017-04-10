///<reference types="chai" />
///<reference types="jquery" />
///<reference types="mocha" />

import { expect } from "chai";

import * as Actions from "../actions/actions";
import * as Model from "../model/model";
import { MainStore } from "./store";

describe("StoreTests", () => {
    let store: MainStore;
    let actionsHub: Actions.ActionsHub;
    let saveCalled: number;
    let fireCalled: number;

    beforeEach(() => {
        actionsHub = new Actions.ActionsHub();

        saveCalled = 0;
        store = new MainStore(actionsHub, "System.Field", 150, 500, (output: string) => {
            ++saveCalled;
        }, () => {
            // settings
        });

        fireCalled = 0;
        store.addListener(() => {
            ++fireCalled;
        });
    });

    it("Does not call save for initial value", () => {
        actionsHub.setContentFromWorkItem.invoke("Initial value");
        expect(saveCalled).to.be.eq(0);
    });

    it("Converts and saves legacy", () => {
        actionsHub.setContentFromWorkItem.invoke("Initial value");
        expect(store.getMode()).to.be.eq(Model.Mode.Legacy);

        actionsHub.toggleState.invoke(null);
        expect(store.getState()).to.be.eq(Model.State.Message);

        actionsHub.resolveConflict.invoke(Model.ConflictResolution.Convert);
        expect(store.getState()).to.be.eq(Model.State.Editor);
        expect(store.getMode()).to.be.eq(Model.Mode.Markdown);
        expect(saveCalled).to.be.eq(1);
    });

    it("Converts and saves modified", () => {
        actionsHub.setContentFromWorkItem.invoke("Initial value");
        expect(store.getMode()).to.be.eq(Model.Mode.Legacy);

        actionsHub.toggleState.invoke(null);
        expect(store.getState()).to.be.eq(Model.State.Message);

        actionsHub.resolveConflict.invoke(Model.ConflictResolution.Convert);
        expect(store.getState()).to.be.eq(Model.State.Editor);
        expect(store.getMode()).to.be.eq(Model.Mode.Markdown);
        expect(saveCalled).to.be.eq(1);
    });

    it("Switches to edit view for empty content", () => {
        // arrange
        actionsHub.toggleState.invoke(null);

        // act
        actionsHub.reset.invoke(null);

        // assert
        expect(store.getState()).to.be.eq(Model.State.Editor);
        expect(fireCalled).to.be.eq(2);
    });
});