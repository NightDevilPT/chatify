import { Logger } from '@nestjs/common';

// Silence logger during tests
Logger.overrideLogger(true);

// Add any global test setup here
console.log('Test setup initialized');