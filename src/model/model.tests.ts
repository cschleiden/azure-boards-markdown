import { expect } from "chai";

import * as $ from "jquery";

import { Model, Utils } from "./model";

describe("Model", () => {
    describe("getItem", () => {
        let m: Model;

        beforeEach(() => {
            m = new Model();
        });

        it("should identify md content", () => {
            let result = Utils.extractMarkdown(`<p style="display:none;" id="md">md**test**</p>  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>`);

            expect(result.markdownContent).to.be.eq("md**test**");
            expect(result.htmlContent).to.be.eq("  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>");
        });

        it("should identify legacy", () => {
            let result = Utils.extractMarkdown(`<p>test</p>  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>`);

            expect(result.markdownContent).to.be.null;
            expect(result.htmlContent).to.be.eq("<p>test</p>  asome&nbsp;<b>html&nbsp;</b>&nbsp;conest<div>asfdl long</div>");
        });
    });
});