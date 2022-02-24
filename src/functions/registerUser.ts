import { APIGatewayProxyResult } from 'aws-lambda';
import { EventWithSchema, wrappedHandler } from '../libs/utils';
import { userService } from "../services";

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string' }
  },
  required: ['email']
} as const;

async function registerUser(event: EventWithSchema<typeof schema>): Promise<APIGatewayProxyResult> {
  console.log("Reg User");
  console.log(event);
  await userService.createUser({ email: event.body.email });
  const users = await userService.getAllUsers();
  return {
    statusCode: 201,
    body: JSON.stringify(users)
  }
}

export const handler = wrappedHandler(registerUser, schema);