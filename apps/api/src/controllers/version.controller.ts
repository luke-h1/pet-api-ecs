import { Request, Response } from 'express';
import VersionService from '../services/version.service';

export default class VersionController {
  private readonly versionService: VersionService;

  constructor() {
    this.versionService = new VersionService();
  }

  async getVersion(req: Request, res: Response) {
    const isXml = req.accepts('application/xml');
    const version = this.versionService.getVersion(isXml);

    if (isXml === 'application/xml') {
      return res.status(200).type('application/xml').send(version);
    }

    return res.status(200).json(version);
  }
}
