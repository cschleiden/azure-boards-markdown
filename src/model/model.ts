import * as $ from "jquery";

import * as toMarkdown from "to-markdown";
import * as marked from "marked";

const markedOptions = {};

export enum Mode {
    None = 0,
    Markdown,
    MarkdownModified,
    Legacy
}

export class Model {
    public markdownContent: string;
    public htmlContent: string;
    public mode: Mode = Mode.None;

    public setInput(rawInput: string) {
        const { markdownContent, htmlContent } = Utils.extractMarkdown(rawInput);
        if (markdownContent) {
            const generatedMarkdownContenxt = marked(markdownContent, markedOptions);
            if (htmlContent.trim() !== generatedMarkdownContenxt.trim()) {
                // Content was changed in legacy editor...
                this.mode = Mode.MarkdownModified;
                this.markdownContent = markdownContent;
                this.htmlContent = htmlContent;
            } else {
                // Match
                this.mode = Mode.Markdown;
                this.setMarkdown(markdownContent);
            }
        } else {
            // No markdown content
            this.mode = Mode.Legacy;
            this.markdownContent = Utils.convertToMarkdown(rawInput);
            this.htmlContent = rawInput;
        }

        console.log(Mode[this.mode]);
    }

    public setMarkdown(content: string) {
        this.markdownContent = content;
        this.htmlContent = marked(content, markedOptions);

        this._triggerChange();
    }

    public getOutput(): string {
        return `<p style="display:none" id="md">${this.markdownContent}</p>${this.htmlContent}`;
    }

    private _listeners: Function[] = [];

    public addListener(handler: Function) {
        this._listeners.push(handler);
    }

    private _triggerChange() {
        for (let listener of this._listeners) {
            listener();
        }
    }
}

export namespace Utils {
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
        let mdElement = parsed.find("#md");

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