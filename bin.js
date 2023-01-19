#! /usr/bin/env node

const { promisify } = require("util");
const { exec } = require("child_process");
const execAsync = promisify(exec);

const login = async () => {
    const { error, stdout } = await execAsync("cloudflared access login https://bitbucket.ship.gov.sg");

    if (error) throw error;

    return stdout;
};

const attachToken = async () => {
    const { error } = await execAsync(`git config --global --replace-all http.https://bitbucket.ship.gov.sg/.extraheader "cf-access-token: $(cloudflared access token -app=https://bitbucket.ship.gov.sg)"`);

    if (error) throw error;
}

const run = async () => {
    try {
        console.log("Attempting login. Please respond to the browser window if it opens...");
        const output = await login();
        if (output) {
            console.log("Attaching token...");
            await attachToken();
            console.log("All done!")
        }
    } catch (error) {
        console.log("Error encountered: ", error);
    }
};

run();