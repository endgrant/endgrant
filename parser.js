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
        if (args == "") {
            let message = "";

            for (const key in info) {
                message += "\n  <b>" + key + "</b> " + info[key];
            }

            return message;
        } else {
            const information = info[args];
            if (information == null) { throw new CommandError("Unknown command: " + args); }
            return "  <b>" + args + "</b> " + information;
        }
    }
}


// Outputs the input
class echo extends Command {
    execute(args) {
        return escapeHTML(args);
    }
}


// Displays the current version
class version extends Command {
    execute(args) {
        return "<b>V4</b>   November 27, 2024";
    }
}


// Shuts down the terminal
class exit extends Command {
    execute(args) {
        window.shutDownSystem();
    }
}




// Parser

// String registry of command information
const info = {
    "help"          : "[command]  <i>Displays information about commands.</i>",
    "echo"          : "[message]  <i>Echoes given text back to the terminal.</i>",
    "version"       : "  <i>Displays information about the current version of Grant System™.</i>",
    "exit"          : "  <i>Shuts down the system.</i>"
}

// Type registry of all the commands
const registry = {
    "help": help,
    "echo": echo,
    "version": version,
    "exit": exit
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