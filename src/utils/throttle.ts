export function throttle(throttleMs: number, action: Function): Function {
    let timeoutHandle: number = null;
    let trailingEdge = false;

    return () => {
        if (!timeoutHandle) {
            // Execute on leading edge
            action();

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