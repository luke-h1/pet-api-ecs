import VersionController from '@api/controllers/version.controller';
import { Express } from 'express';

export default class VersionRoutes {
  private readonly app: Express;

  private readonly versionController: VersionController;

  constructor(app: Express) {
    this.app = app;
    this.versionController = new VersionController();
  }

  public setupRoutes(): void {
    this.app.get('/api/version', (req, res) => {
      return this.versionController.getVersion(req, res);
    });
  }
}
