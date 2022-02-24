import User from "../models/User";
import UserRepository from "./UserRepository";

export default class UserService {
  constructor(
    private readonly userRepo: UserRepository
  ) { }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.getUsers();
  }

  async createUser(user: User): Promise<void> {
    return await this.userRepo.saveUser(user);
  }
}