import * as Commands from '../command';
import regCommand from '@/utils/command';

const commands = {};

const registerCommands = () => {
  for (let command of Object.values(Commands)) registerCommand(command.name, command);
};

const registerCommand = (name: string, callback: Function) => {
  regCommand(commands, name, callback);
};

const execCommand = (name: string, ...arg: any[]) => {
  const commandCallBack = commands[name];

  if (commandCallBack) {
    commandCallBack(...arg);
  } else {
    console.error(`Command not found: ${name}`);
  }
};

export default () => {
  registerCommands();
  return {
    registerCommand,
    execCommand,
  };
};
