import { Injectable } from "@nestjs/common";
import { User, UserProfile, generateId } from "@uit-go/shared";

@Injectable()
export class UserService {
  private users: Map<string, User> = new Map();

  async createUser(data: { email: string; password: string; profile: UserProfile }): Promise<User> {
    const user: User = {
      id: generateId(),
      email: data.email,
      password: data.password, // In real app, hash this
      profile: data.profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}
