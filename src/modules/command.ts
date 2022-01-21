interface ICalculator {
	value: number;
	history: ICommand[];
	executeCommand: (command: ICommand) => void;
	undo: () => void;
	add: (valueToAdd: number) => void;
	subtract: (valueToSubtract: number) => void;
	multiply: (valueToMultiply: number) => void;
	divide: (valueToDivide: number) => void;
}

export default class Calculator implements ICalculator {
	value: number;
	history: ICommand[];

	constructor() {
		this.value = 0;
		this.history = [];
	}

	executeCommand(command: ICommand) {
		this.value = command.execute(this.value);
		this.history.push(command);
	}

	undo() {
		const command = this.history.pop();
		if (command) this.value = command.undo(this.value);
	}

	add(valueToAdd: number) {
		this.value += valueToAdd;
	}

	subtract(valueToSubtract: number) {
		this.value -= valueToSubtract;
	}

	multiply(valueToMultiply: number) {
		this.value *= valueToMultiply;
	}

	divide(valueToDivide: number) {
		this.value /= valueToDivide;
	}
}

interface ICommand {
	execute: (currentValue: number) => number;
	undo: (currentValue: number) => number;
}

interface IAddCommand extends ICommand {
	valueToAdd: number;
}

export class AddCommand implements IAddCommand {
	valueToAdd: number;

	constructor(valueToAdd: number) {
		this.valueToAdd = valueToAdd;
	}

	execute(currentValue: number) {
		return currentValue + this.valueToAdd;
	}

	undo(currentValue: number) {
		return currentValue - this.valueToAdd;
	}
}

interface ISubtractCommand extends ICommand {
	valueToSubtract: number;
}

export class SubtractCommand implements ISubtractCommand {
	valueToSubtract: number;

	constructor(valueToSubtract: number) {
		this.valueToSubtract = valueToSubtract;
	}

	execute(currentValue: number) {
		return currentValue - this.valueToSubtract;
	}

	undo(currentValue: number) {
		return currentValue + this.valueToSubtract;
	}
}

interface IMultiplyCommand extends ICommand {
	valueToMultiply: number;
}

export class MultiplyCommand implements IMultiplyCommand {
	valueToMultiply: number;

	constructor(valueToMultiply: number) {
		this.valueToMultiply = valueToMultiply;
	}

	execute(currentValue: number) {
		return currentValue * this.valueToMultiply;
	}

	undo(currentValue: number) {
		return currentValue / this.valueToMultiply;
	}
}

interface IDivideCommand extends ICommand {
	valueToDivide: number;
}

export class DivideCommand implements IDivideCommand {
	valueToDivide: number;

	constructor(valueToDivide: number) {
		this.valueToDivide = valueToDivide;
	}

	execute(currentValue: number) {
		return currentValue / this.valueToDivide;
	}

	undo(currentValue: number) {
		return currentValue * this.valueToDivide;
	}
}

interface IAddThenMultiplyCommand extends ICommand {
	addCommand: AddCommand;
	multiplyCommand: MultiplyCommand;
}

export class AddThenMultiplyCommand implements IAddThenMultiplyCommand {
	addCommand: AddCommand;
	multiplyCommand: MultiplyCommand;

	constructor(valueToAdd: number, valueToMultiply: number) {
		this.addCommand = new AddCommand(valueToAdd);
		this.multiplyCommand = new MultiplyCommand(valueToMultiply);
	}

	execute(currentValue: number) {
		const newValue = this.addCommand.execute(currentValue);
		return this.multiplyCommand.execute(newValue);
	}

	undo(currentValue: number) {
		const newValue = this.multiplyCommand.undo(currentValue);
		return this.addCommand.undo(newValue);
	}
}
