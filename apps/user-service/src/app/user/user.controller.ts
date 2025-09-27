import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { User, UserProfile } from "@uit-go/shared";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern("user.create")
  async createUser(data: { email: string; password: string; profile: UserProfile }): Promise<User> {
    return this.userService.createUser(data);
  }

  @MessagePattern("user.findById")
  async findUserById(id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @MessagePattern("user.findByEmail")
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }

  @MessagePattern("user.update")
  async updateUser(data: { id: string; updates: Partial<User> }): Promise<User> {
    return this.userService.updateUser(data.id, data.updates);
  }

  @MessagePattern("user.delete")
  async deleteUser(id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
