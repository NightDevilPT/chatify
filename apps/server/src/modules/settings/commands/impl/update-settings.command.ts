import { ICommand } from '@nestjs/cqrs';
import { UpdateSettingDto } from '../../dto/update-setting.dto';

export class UpdateSettingsCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly updateData: UpdateSettingDto,
  ) {}
}
