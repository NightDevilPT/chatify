import { ICommand } from '@nestjs/cqrs';
import { CreateSettingDto } from '../../dto/create-setting.dto';

export class CreateSettingsCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly settingsData: CreateSettingDto,
  ) {}
}
