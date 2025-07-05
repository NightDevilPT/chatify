import { UsersModule } from "./users/users.module";
import { ProfilesModule } from "./profile/profile.module";
import { SettingsModule } from "./settings/settings.module";
import { ChatSocketModule } from "./chat-socket/chat-socket.module";

export const Modules = [
	ChatSocketModule,
	UsersModule,
	SettingsModule,
	ProfilesModule
]