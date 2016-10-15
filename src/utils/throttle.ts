/**
 * Throttles function invocation. 
 * Note: Arguments passed to the last call will be used
 */
export function throttle(throttleMs: number, action: (...args: any[]) => void, leading: boolean = true): (...args: any[]) => void {
    let timeoutHandle: number = null;
    let trailingEdge = false;
    let lastArgs: any[] = [];

    return (...args: any[]): void => {
        lastArgs = args || [];

        if (!timeoutHandle) {
            if (leading) {
                // Execute on leading edge
                action(...lastArgs);
            } else {
                trailingEdge = true;
            }

            timeoutHandle = window.setTimeout(() => {
                if (trailingEdge) {
                    action(...lastArgs);
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