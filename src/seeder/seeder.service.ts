import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { USER_ROLE } from 'src/users/constants/user.constants';
import { UserService } from 'src/users/users.service';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.createAdminUser();
  }

  private async createAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await this.userService.findByEmail(adminEmail);
    if (!existingAdmin) {
      await this.userService.createUser({
        email: adminEmail,
        password: adminPassword,
        role: USER_ROLE.ADMIN,
        isActive: true,
        name: 'admin',
      });

      // await this.userRepository.create(adminUser);
      this.logger.log(`Admin user created with email: ${adminEmail}`);
    } else {
      this.logger.log(`Admin user already exists: ${adminEmail}`);
    }
  }
}
