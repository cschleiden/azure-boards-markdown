import * as $ from "jquery";

import * as toMarkdown from "to-markdown";
import * as marked from "marked";

const __md = "__md";
const __mdStyle = "__mdStyle";

export enum Mode {
    None = 0,
    Markdown,
    MarkdownModified,
    Legacy
}

export enum ConflictResolution {
    Convert,
    Ignore
}

export const sharedStyles = `code, pre { background:#ededed } pre { padding: 5px; }`;

export class Model {
    public markdownContent: string;
    public htmlContent: string;
    public mode: Mode = Mode.None;

    public showPreview: boolean = true;
    public showMessage: boolean = false;

    public switchToEdit() {
        if (this.mode !== Mode.Markdown) {
            this.showMessage = true;
        } else {
            this.showPreview = false;
        }

        this._triggerStateChange();
    }

    public switchToPreview() {
        this.showPreview = true;

        this._triggerStateChange();
    }

    public cancelEdit() {
        this.showMessage = false;

        this._triggerStateChange();
    }

    public resolveConflict(resolution: ConflictResolution) {
        switch (resolution) {
            case ConflictResolution.Convert:
                this.convertHtmlToMarkdown();
                break;

            case ConflictResolution.Ignore:
                // Model automatically converts, just proceed to editor
                this.ignoreChanges();
                break;
        }

        this.showMessage = false;
        this.showPreview = false;

        this._triggerStateChange();
    }

    public setInput(rawInput: string, forceViewChange: boolean) {
        if (rawInput === this.getOutput().trim()) {
            // Ignore, most likely our own change
            return;
        }

        const { markdownContent, htmlContent } = Utils.extractMarkdown(rawInput);
        if (markdownContent) {
            const generatedMarkdownContenxt = Utils.renderMarkdown(markdownContent);

            if (htmlContent.trim() !== generatedMarkdownContenxt.trim()) {
                // Content was changed in legacy editor
                this.mode = Mode.MarkdownModified;
            } else {
                // Match
                this.mode = Mode.Markdown;
            }

            this.markdownContent = markdownContent;
            this.htmlContent = htmlContent;
        } else {
            // No markdown content
            this.mode = Mode.Legacy;
            this.htmlContent = rawInput;
        }

        console.log(Mode[this.mode]);

        if (forceViewChange) {
            // Reset view
            this.showMessage = false;
            this.showPreview = true;
        } else {
            if (this.mode !== Mode.Markdown && !this.showPreview) {
                this.showMessage = true;
            }
        }

        this._triggerStateChange();
    }

    public setMarkdown(content: string) {
        this.markdownContent = content;
        this.htmlContent = Utils.renderMarkdown(content);

        // Model is now compliant
        this.mode = Mode.Markdown;

        this._triggerDataChange();
    }

    public convertHtmlToMarkdown() {
        if (this.mode !== Mode.MarkdownModified && this.mode !== Mode.Legacy) {
            throw new Error("Invalid mode for conversion");
        }

        this.setMarkdown(Utils.convertToMarkdown(this.htmlContent));
    }

    public ignoreChanges() {
        if (this.mode !== Mode.MarkdownModified) {
            throw new Error("Invalid mode for ignore");
        }

        this.setMarkdown(this.markdownContent);
    }

    public getOutput(): string {
        return `<p style="display:none" id="${__md}">${this.markdownContent}</p><style id="${__mdStyle}">${sharedStyles}></style>${this.htmlContent}`;
    }

    private _dataListeners: Function[] = [];
    public addDataListener(handler: Function) {
        this._dataListeners.push(handler);
    }

    private _triggerDataChange() {
        for (let listener of this._dataListeners) {
            listener();
        }
    }

    private _stateListeners: Function[] = [];
    public addStateListener(handler: Function) {
        this._stateListeners.push(handler);
    }

    private _triggerStateChange() {
        for (let listener of this._stateListeners) {
            listener();
        }
    }
}

export namespace Utils {
    export function renderMarkdown(input: string): string {
        return marked(input, {})
    }

    export function convertToMarkdown(value: string): string {
        // Work around strange spacing issues
        value = value.replace("&nbsp;", " ");

        return toMarkdown(value, {
            converters: [
                {
                    filter: "&nbsp;",
                    replacement: (innerHtml) => " "
                },
                {
                    filter: ["span"],
                    replacement: (innerHtml, node: HTMLSpanElement) => {
                        if (node.style && node.style.fontStyle) {
                            if (node.style.fontStyle === "italic") {
                                return `_${innerHtml}_`;
                            } else if (node.style.fontStyle === "italic") {
                                return `*${innerHtml}*`;
                            }
                        }

                        return innerHtml;
                    }
                },
                {
                    filter: ["div"],
                    replacement: (innerHtml) => `\n${innerHtml}`
                }
            ]
        });
    }

    export function extractMarkdown(value: string): { markdownContent: string; htmlContent: string; } {
        let parsed = $("<div></div>").html(value);
        parsed.find(`#${__mdStyle}`).remove();
        let mdElement = parsed.find(`#${__md}`);

        if (mdElement.length === 0) {
            return {
                markdownContent: null,
                htmlContent: value
            };
        } else {
            const md = mdElement.text();
            mdElement.remove();

            return {
                markdownContent: md,
                htmlContent: parsed.html()
            };
        }
    }
}