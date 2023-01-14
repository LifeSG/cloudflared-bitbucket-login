#! /usr/bin/env node

const { promisify } = require("util");
const { exec } = require("child_process");
const execAsync = promisify(exec);

const execute = async (command, showSuccess) => {
    // Generate access token
    const { stderr, stdout } = await execAsync(command);
    if (stderr) {
        throw stderr;
    }

    if (showSuccess && stdout) {
        console.log(stdout);
    }
}

const run = async () => {
    console.log("Retrieving your Cloudflare access token. Please head to your browser to approve");
    await execute("cloudflared access login https://bitbucket.ship.gov.sg", true);

    console.log("Applying access token to Bitbucket headers");
    await execute(`git config --global --replace-all http.https://bitbucket.ship.gov.sg/.extraheader "cf-access-token: $(cloudflared access token -app=https://bitbucket.ship.gov.sg)"`);
    
    console.log("All good to go!");
};

run();