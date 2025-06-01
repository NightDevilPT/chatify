import { ChatSocketModule } from "./chat-socket/chat-socket.module";
import { ProfilesModule } from "./profile/profile.module";
import { Settings } from "./settings/entities/setting.entity";
import { UsersModule } from "./users/users.module";

export const Modules = [
	ChatSocketModule,
	UsersModule,
	Settings,
	ProfilesModule
]