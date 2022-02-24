import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { middify } from '../libs/utils';
import User from '../models/User';
import { userService } from "../services";

async function getUsers(_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {    
    const users: User[] = await retrieveUsers();
    return {
        statusCode: 200,
        body: JSON.stringify(users)
    }
}

export async function retrieveUsers(): Promise<User[]> {  
    const users: User[] = await userService.getAllUsers();
    return users;
}

export const handler = middify(getUsers);