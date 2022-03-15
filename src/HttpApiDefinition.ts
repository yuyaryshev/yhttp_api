import { constant, Decoder, DecoderObject, number, object } from "@mojotech/json-type-validation";
import type { Method } from "./callerLib";

export type MustBeTypedStringLiteral<T extends string> = string extends T ? never : T;
export type CantHaveFieldT<DecoderObj> = DecoderObj extends { routeUrl: infer T; [key: string]: any } ? { routeUrl: never } : {};
export type DecoderArg<DecoderObj> = DecoderObj extends Decoder<infer T> ? T : never;

// <TLiteral extends string, TApiRequest, TApiResponse> ApiDefinition<TLiteral, TApiRequest, TApiResponse>
export interface HttpApiDefinition<TLiteral extends string, TApiRequest, TApiResponse> {
    routeUrl: TLiteral;
    method: Method;
    request: TApiRequest;
    response: TApiResponse;
    requestDecoder: Decoder<TApiRequest>;
    responseDecoder: Decoder<TApiResponse>;
}
export function isHttpApiDefinition(v: any): v is HttpApiDefinition<any, any, any> {
    return typeof v === "object" && v.routeUrl && v.requestDecoder;
}

export function httpApiDefinition<TLiteral extends string, TApiRequestDecoderObj, TApiResponseDecoderObj>(
    method: Method,
    routeUrl: MustBeTypedStringLiteral<TLiteral>,
    request: DecoderObject<TApiRequestDecoderObj & CantHaveFieldT<TApiRequestDecoderObj>>,
    response: DecoderObject<TApiResponseDecoderObj>,
): HttpApiDefinition<TLiteral, TApiRequestDecoderObj, TApiResponseDecoderObj> {
    if ((request as any).routeUrl) {
        throw new Error(
            `CODE00000003 Request can't have 'routeUrl' field! as this name is reserved for request type! 'routeUrl' should be passed as the first parameter!`,
        );
    }
    return {
        routeUrl,
        method,
        request: undefined as any,
        response: undefined as any,
        requestDecoder: object(request),
        responseDecoder: object(response),
    };
}

// Example:
export const exampleApi = httpApiDefinition(
    "GET",
    "example",
    {
        //t:"example",
        x: number(),
    },
    {
        y: number(),
    },
);

const x1: typeof exampleApi.routeUrl = "example";
const x2: typeof exampleApi.request = { x: 1 };
const x3: typeof exampleApi.response = { y: 2 };

// optional:
// export type ExampleApiT = typeof exampleApi.t;
// export type ExampleApiRequest = typeof exampleApi.request;
// export type ExampleApiResponse = typeof exampleApi.response;
