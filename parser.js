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

            for (const key in cmd_info) {
                message += "\n  <b>" + key + "</b> " + cmd_info[key];
            }

            return message;
        } else {
            const information = cmd_info[args];
            if (information == null) { throw new CommandError("Unknown command: \"" + args + "\""); }
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
        return "<b>V6</b>  Last updated: November 30, 2024";
    }
}


// Shuts down the terminal
class exit extends Command {
    execute(args) {
        window.shutDownSystem();
    }
}


// Displays information about projects
class projects extends Command {
    execute(args) {
        if (args == "") {
            let message = "";

            for (const key in prj_info) {
                message += "\n  <b>" + key + "</b> " + prj_info[key];
            }

            return message;
        } else {
            const information = prj_info[args];
            if (information == null) { throw new CommandError("Project not found: \"" + args + "\""); }
            return "  <b>" + args + "</b> " + information;
        }
    }
}


// Redirects to the passed project
class view extends Command {
    execute(args) {
        const link = directory[args];
        if (link == null) { throw new CommandError("Project not found: \"" + args + "\""); }
        window.open(link, "_blank");
        return "Opening: <u>" + link + "</u>";
    }
}




// Parser

// String registry of command information
const cmd_info = {
    "help": "       [command]   <i>Displays information about commands.</i>",
    "echo": "       [message]   <i>Echoes given text back to the terminal.</i>",
    "version": "                <i>Displays information about the current version of Grant System™.</i>",
    "exit": "                   <i>Shuts down the system.</i>",
    "projects": "   [project]   <i>Displays information about projects.</i>",
    "view": "       &ltproject&gt   <i>Navigates to the given project.</i>"
}

// String registry of project information
const prj_info = {
    "Weaver": "         Oct 08, 2024   <i>Arachnid survival minigame</i>",
    "Slapslick": "      Sep 02, 2024   <i>Comedic bullet-hell</i>",
    "Made for Scales": "Aug 20, 2024   <i>Food-themed puzzler</i>",
    "Deep Space": "     Jun 18, 2024   <i>Top-down space shooter</i>"
}

// Type registry of all the commands
const registry = {
    "help": help,
    "echo": echo,
    "version": version,
    "exit": exit,
    "projects": projects,
    "view": view
};

// String registry of project links
const directory = {
    "Weaver":       "https://inre-dan.itch.io/weaver",
    "Slapstick":        "https://inre-dan.itch.io/mini-jame-gam-34",
    "Made for Scales":      "https://inre-dan.itch.io/made-for-scales",
    "Deep Space":       "https://inre-dan.itch.io/deep-space"
}


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
        return "Unknown command: \"" + commandName + "\"";
    }

    try {
        const commandInstance = new CommandClass();
        return commandInstance.execute(args);
    } catch (error) {
        if (error instanceof CommandError) {
            return error.message;
        } else {
            console.error(`Error executing command: \"${error.message}\"`);
            return "Error executing command \"" + commandName + "\"";
        }
    }
}