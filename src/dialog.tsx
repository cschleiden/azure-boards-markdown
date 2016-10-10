import * as React from "react";
import * as ReactDOM from "react-dom";

import { PreviewComponent } from "./components/preview";
import { SizeMode } from "./model/model";

import "dialog.scss";

const config = VSS.getConfiguration();

ReactDOM.render(<PreviewComponent
    actionsCreator={null}
    htmlContent={config.htmlContent}
    sizeMode={SizeMode.Default}
    />, document.getElementById("content"));