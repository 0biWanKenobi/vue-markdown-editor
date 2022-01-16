import * as DefaultCommands from '../command';

const commands: Record<string, Function> = {};

const addDefaultCommands = () => {
  for (const command of Object.values(DefaultCommands)) registerCommand(command.name, command);
};

const registerCommand = (name: string, callback: Function) => {
  if (name) {
    if (!commands[name]) {
      commands[name] = callback;
    } else {
      console.error(`The command name is already in use: ${name}`);
    }
  } else {
    console.error('Command name is required');
  }
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
  return {
    addDefaultCommands,
    registerCommand,
    execCommand,
  };
};
