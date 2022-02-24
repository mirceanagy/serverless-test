import User from "../models/User";
import Client from "serverless-mysql"

export default class UserRepository {
    constructor(
        private readonly client: Client.ServerlessMysql) {
    }

    async init(): Promise<void> {
        await this.client.query(`
        CREATE TABLE IF NOT EXISTS users
        (
            id MEDIUMINT UNSIGNED not null AUTO_INCREMENT, 
            email varchar(100) not null, 
            PRIMARY KEY (id)
        );
        `);
    }

    async getUser(id: string): Promise<User[]> {
        await this.init();
        return await this.client.query<User[]>(`select id, email from users where id = ?`, [id]);
    }

    async getUsers(): Promise<User[]> {
        await this.init();
        return await this.client.query<User[]>(`select id, email from users`);
    }

    async saveUser(user:User): Promise<void> { 
        await this.init();
        await this.client.query<void>('INSERT INTO users (email) VALUES(?)', [user.email]);
    }

}