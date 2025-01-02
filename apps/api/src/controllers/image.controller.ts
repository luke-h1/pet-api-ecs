import { Request, Response } from 'express';
import ImageService from '../services/image.service';

export default class ImageController {
  private readonly imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async createImages(req: Request, res: Response) {
    const images = await this.imageService.createImages(req);

    if (!images.length) {
      return res.status(400).json({ message: 'No files provided' });
    }

    return res.status(201).json({
      images,
    });
  }
}
