import UserRepository from "../../src/services/UserRepository";
import Client from "serverless-mysql"

let userRepository: UserRepository;
let client: Client.ServerlessMysql;

// jest.mock('../../src/services/UserService', () => {
//     return function () {
//         return {
//             async createUser(_user: User): Promise<void> {
//                 // Do nothing
//             }
//         };
//     };
// });

beforeAll(async () => {
    client = require('serverless-mysql')({
        config: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        }
    });
    userRepository = new UserRepository(client);
});

afterAll(async () => {
    client.quit()
});

describe('createUser', () => {
    it('should save new entity and get an ID from the DB', async () => {
        const emailInput = 'test_' + Date.now().toString();
        await userRepository.saveUser({
            email: emailInput
        });
        const users = await userRepository.getUsers();
        expect(users.map(u => u.email)).toContainEqual(emailInput);
    })
})