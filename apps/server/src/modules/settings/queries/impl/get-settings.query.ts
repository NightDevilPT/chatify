import { IQuery } from '@nestjs/cqrs';

export class GetSettingsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
