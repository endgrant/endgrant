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

// Displays information about commands
class help extends Command {
    execute(args) {
        const message = `
    <b>help</b> Displays information about commands.
    <b>echo</b> Echoes given text back to the terminal.`

        return message;
    }
}

// Outputs the input
class echo extends Command {
    execute(args) {
        return escapeHTML(args);
    }
}




// Parser

// String registry of all the commands
const registry = {
    "help": help,
    "echo": echo
};


// Parses the given text to be HTML-safe
function escapeHTML(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}


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