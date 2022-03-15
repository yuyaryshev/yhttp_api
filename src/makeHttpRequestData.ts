import type { Method, RequestConfig } from "./callerLib";

export function makeHttpRequestData(method: Method, requestData: unknown): RequestConfig {
    switch (method) {
        case "GET":
            return {
                params: requestData,
                // params: qs.stringify(requestData),
            };
        case "PUT":
        case "POST":
            return {
                data: requestData,
                // data: JSON.stringify(requestData),
            };
        default:
            throw new Error(`CODE00000001 Method '${method}' @notImplemented by httpRequestConfig`);
    }
}
