import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: DbService) {}
}
