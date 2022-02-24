import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import validator from '@middy/validator';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import type { JSONSchema, FromSchema } from "json-schema-to-ts";
import { normalizeHttpResponse } from '@middy/util';

type LambdaFunc = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export const middify = (handler: LambdaFunc): middy.MiddyfiedHandler => middy(handler)
    .use([
        httpJsonBodyParser(),
        httpEventNormalizer(),
        httpResponseHandler(),
        httpRequestHandler()
    ]);

export type EventWithSchema<S> = APIGatewayProxyEvent & { body: FromSchema<S> };

export const wrappedHandler = (handler: LambdaFunc, schema: JSONSchema): middy.MiddyfiedHandler =>
    middy(handler).use([
        httpJsonBodyParser(),
        httpEventNormalizer(),
        validator({
            inputSchema:
            {
                type: 'object',
                properties: {
                    body: schema
                },
                required: [
                    'body'
                ]
            }
            , ajvOptions: { strict: false }
        }),
        httpResponseHandler(),
        httpRequestHandler()
    ]);

const responseHandler: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
    request.response = normalizeHttpResponse(request.response);
    if (request.error) {
        console.error(`API Error: ${request.error.message}`, request.error);
        request.response.statusCode = 500;
        request.response.body = JSON.stringify({
            status: request.response.statusCode,
            message: request.error.message ? request.error.message : 'Internal Error'
        });
    }
    request.response.headers['Content-Type'] = 'application/json';
    request.response.headers['Access-Control-Allow-Origin'] = request.event.headers['origin'];
    request.response.headers['Access-Control-Allow-Credentials'] = true;
}

const requestHandler: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request): Promise<void> => {
    const auth = request.event.headers["Authorization"];
    console.log(`Decode the JWT from ${auth} and set its data onto the request.event.requestContext.authorizer`);
}

const httpResponseHandler = () => ({
    after: responseHandler,
    onError: responseHandler
});

const httpRequestHandler = () => ({
    before: requestHandler
});