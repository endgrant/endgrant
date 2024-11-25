// Abstractions

// Command class
class Command {
    // Executes the command and returns an output-log string
    execute(args) {
        throw new CommandError("Attempt to execute unimplemented command.");
    }
}


// Command exception
class CommandError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}




// Implemented commands

// Outputs the input
class echo extends Command {
    execute(args) {
        return args;
    }
}




// Parser

// String registry of all the commands
const registry = {
    "echo": echo
};


// Parse and execute based on calling name
function parseAndExecute(input) {
    const trimmedInput = input.trim();
    const spaceIndex = trimmedInput.indexOf(' ');
    let commandName = trimmedInput;
    let args = "";
    if (spaceIndex >= 0) {
        commandName = trimmedInput.substring(0, spaceIndex);
        args = trimmedInput.substring(spaceIndex + 1);
    }

    const CommandClass = registry[commandName];

    if (!CommandClass) {
        return "Unknown command: " + commandName;
    }

    try {
        const commandInstance = new CommandClass();
        return commandInstance.execute(args);
    } catch (error) {
        if (error instanceof CommandError) {
            return error.message;
        } else {
            console.error(`Error executing command: ${error.message}`);
            return "Error executing command \"" + commandName + "\"";
        }
    }
}