import { HttpApiDefinition } from "./HttpApiDefinition.js";
import { makeHttpRequestData } from "./makeHttpRequestData.js";
import { CallerInstance } from "./callerLib.js";

/**
 * Calls api. Verifies request and response data.
 * @param axios - Axios instance
 * @param apiDefinition - api definition
 * @param requestData - api arguments
 * @example const r = await callApi(session, apiExample, \{x:1\});
 */
export async function httpApiCall<TLiteral extends string, TApiRequest, TApiResponse>(
    axios: CallerInstance,
    apiDefinition: HttpApiDefinition<TLiteral, TApiRequest, TApiResponse>,
    requestData: TApiRequest,
): Promise<TApiResponse> {
    if (apiDefinition.requestDecoder) {
        apiDefinition.requestDecoder.runWithException(requestData);
    }
    const { method } = apiDefinition;
    const requestConfig = makeHttpRequestData(method, requestData);

    requestConfig.method = method;
    requestConfig.url = apiDefinition.routeUrl;

    const responseData = await axios(requestConfig);
    return (apiDefinition.responseDecoder ? apiDefinition.responseDecoder.runWithException(responseData) : responseData) as TApiResponse;
}

/**
 * Creates a function for specified api to call it through supplied socket
 * @param axios - Axios instance
 * @param apiDefinition - api definition
 * @example const callApiExample = httpApiFunction(session, apiExample);
 */
export function httpApiFunction<TLiteral extends string, TApiRequest, TApiResponse>(
    axios: CallerInstance,
    apiDefinition: HttpApiDefinition<TLiteral, TApiRequest, TApiResponse>,
): (requestData: TApiRequest) => Promise<TApiResponse> {
    const { method } = apiDefinition;
    return async (requestData: TApiRequest): Promise<TApiResponse> => {
        if (apiDefinition.requestDecoder) {
            apiDefinition.requestDecoder.runWithException(requestData);
        }
        const requestConfig = makeHttpRequestData(method, requestData);

        requestConfig.method = method;
        requestConfig.url = apiDefinition.routeUrl;

        const response = await axios(requestConfig);
        return (apiDefinition.responseDecoder ? apiDefinition.responseDecoder.runWithException(response.data) : response.data) as TApiResponse;
    };
}
