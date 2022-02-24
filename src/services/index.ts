import UserService from "./UserService";
import Client from "serverless-mysql"
import UserRepository from "./UserRepository";

const client = Client({
    config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
})

export const userRepository = new UserRepository(client);
export const userService = new UserService(userRepository);