export function throttle(throttleMs: number, action: Function, leading: boolean = true): Function {
    let timeoutHandle: number = null;
    let trailingEdge = false;

    return () => {
        if (!timeoutHandle) {
            if (leading) {
                // Execute on leading edge
                action();
            } else {
                trailingEdge = true;
            }

            timeoutHandle = window.setTimeout(() => {
                if (trailingEdge) {
                    action();
                }

                timeoutHandle = null;
                trailingEdge = false;
            }, throttleMs);
        } else {
            // Schedule execution after waiting period
            trailingEdge = true;
        }
    };
}