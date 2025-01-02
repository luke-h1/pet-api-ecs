import AdminService from '@api/services/admin.service';
import { Request, Response } from 'express';

export default class AdminController {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async flushRedis(_req: Request, res: Response) {
    const result = await this.adminService.flush();

    if (result === 'ERROR') {
      return res.status(500).json({ message: 'Failed to flush redis' });
    }
    return res.status(200).json({ result: 'OK' });
  }
}
