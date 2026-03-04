#!/usr/bin/env node

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))

.command("init", "Initialize repository", {}, () => {
    initRepo();
})

.command(
    "add <file>",
    "Add file to staging",
    (yargs) => {
        yargs.positional("file", {
            describe: "File to stage",
            type: "string"
        });
    },
    (argv) => {
        addRepo(argv.file);
    }
)

.command(
    "commit <message>",
    "Commit staged files",
    (yargs) => {
        yargs.positional("message", {
            describe: "Commit message",
            type: "string"
        });
    },
    (argv) => {
        commitRepo(argv.message);
    }
)

.command("push", "Push commits", {}, () => {
    pushRepo();
})

.command("pull", "Pull commits", {}, () => {
    pullRepo();
})

.command(
    "revert <commitID>",
    "Revert commit",
    (yargs) => {
        yargs.positional("commitID", {
            describe: "Commit ID",
            type: "string"
        });
    },
    (argv) => {
        revertRepo(argv.commitID);
    }
)

.demandCommand(1, "You must provide a command")
.help()
.argv;