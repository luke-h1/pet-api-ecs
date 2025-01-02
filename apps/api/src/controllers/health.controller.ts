import { Request, Response } from 'express';
import xml from 'xml';
import HealthService from '../services/health.service';

export default class HealthController {
  private readonly healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public async health(req: Request, res: Response) {
    const isXml = req.accepts('application/xml');
    const { cache, db } = await this.healthService.health();

    if (!db || !cache) {
      const message = `Cannot connect to ${!db ? 'DB' : ''}${!db && !cache ? ' and ' : ''}${!cache ? 'cache' : ''}`;

      if (isXml === 'application/xml') {
        const xmlResponse = xml({
          health: [{ db }, { cache }, { status: 'ERROR' }, { message }],
        });
        return res.status(500).type('application/xml').send(xmlResponse);
      }
      return res.status(500).json({
        db: !!db,
        cache: !!cache,
        status: 'ERROR',
        message,
      });
    }

    if (isXml === 'application/xml') {
      const xmlResponse = xml({
        health: [{ db }, { cache }, { status: 'OK' }],
      });
      return res.status(200).type('application/xml').send(xmlResponse);
    }

    return res.status(200).json({
      db: true,
      cache: true,
      status: 'OK',
    });
  }
}
