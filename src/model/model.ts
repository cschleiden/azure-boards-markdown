export enum State {
    Preview,
    Editor,
    Message
}

export enum Mode {
    None = 0,
    Markdown,
    MarkdownModified,
    Legacy
}

export enum SizeMode {
    Default = 0,
    AutoGrow
}

export enum ConflictResolution {
    Cancel,
    Convert,
    Ignore
}

export enum FormatAction {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3
}

const lineHeightInPx = 20;

/*
export class Model {
    public markdownContent: string;
    public htmlContent: string;
    public mode: Mode = Mode.None;

    public autoGrow: boolean = false;
    public showPreview: boolean = true;
    public showMessage: boolean = false;

    private _block = false;

    public setBlock(block: boolean) {
        this._block = block;
    }

    public switchToEdit() {
        if (this.showMessage || !this.showPreview) {
            // Already editing
            return;
        }

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

    public toggleAutoGrow() {
        this.autoGrow = !this.autoGrow;

        this._triggerStateChange();
    }

    private _height: number;
    public setHeight(height: number) {
        this._height = height;

        this._triggerStateChange();
    }    

    public getDesiredHeight(): number {
        return this._height + (this.showPreview ? 45 : 25);
        /*

        if (this.showPreview) {
            // TODO: Conceptually this doesn't belong here
            let $iframe = $("body").find("iframe");
            if ($iframe && $iframe.length > 0) {
                let body = ($iframe[0] as HTMLIFrameElement).contentWindow.document.body;
                if (body) {
                    return $(body).find(".frame-root").outerHeight(true) + 45;
                }
            }

            return null;
        } else {
            let ta = $("textarea")[0];
            if (ta) {
                ta.style.height = "auto";
                const scrollHeight = ta.scrollHeight;
                ta.style.height = "";
                //ta.style.height = `${scrollHeight}px`;
                return scrollHeight + 25;
                //const numberOfLines = this.markdownContent.split(/\r?\n/).length;
                //return numberOfLines * lineHeightInPx + 25;
            }

            return null;
        }
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
        if (!markdownContent && !htmlContent) {
            this.mode = Mode.Markdown;
            this.markdownContent = "";
            this.htmlContent = "";
        } else if (markdownContent) {
            const generatedMarkdownContenxt = Utils.renderMarkdown(markdownContent);

            const trimmedHtmlContent = htmlContent.trim();

            if (trimmedHtmlContent !== "" && trimmedHtmlContent !== generatedMarkdownContenxt.trim()) {
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
        let b: string = "";
        if (this._block) {
            b = block;
        }

        return `<div style="display:none; width: 0; height: 0; overflow: hidden; position: absolute; font-size: 0;" id="${__md}">${this.markdownContent}</div><style id="${__mdStyle}">${sharedStyles}></style>${b}<div class="rendered-markdown">${this.htmlContent}</div>`;
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
*/