const fs = require('fs');
const readlineSync = require('readline-sync');

// check if ./.env exists
if (fs.existsSync('./.env')) {
    const useExistingEnv = readlineSync.keyInYN('Would you like to use the existing .env file?');
    if (!useExistingEnv) {
              // delete .env
            fs.unlinkSync('./.env');
            console.log('Deleted .env');
            createEnvFile();
    } else {
        // use existing .env
        console.log('Using existing .env');
        // load .env
        require('dotenv').config();
        startPresence();
    }
} else {
    createEnvFile();
    console.log('Created and using .env');
}

function createEnvFile() {
    fs.writeFileSync('./.env', '');
    // get the id from keyboard input and write it to .env file
    let id = readlineSync.question('Enter your application id: ');
    // check if id is number only and loop until it is
    while (!/^\d+$/.test(id)) {
        console.log('Invalid id, please try again');
        id = readlineSync.question('Enter your application id: ');
    }
    fs.appendFileSync('./.env', `APPLICATION_ID=${id}`);

    let state = readlineSync.question('Enter your presence state: ');
    fs.appendFileSync('./.env', `\nSTATE=${state}`);

    let details = readlineSync.question('Enter your presence details: ');
    fs.appendFileSync('./.env', `\nDETAILS=${details}`);

    let largeImageKey = readlineSync.question('Enter your large image key: ');
    fs.appendFileSync('./.env', `\nLARGE_IMAGE_KEY=${largeImageKey}`);

    let smallImageKey = readlineSync.question('Enter your small image key: ');
    fs.appendFileSync('./.env', `\nSMALL_IMAGE_KEY=${smallImageKey}`);

    let largeImageText = readlineSync.question('Enter your large image text: ');
    fs.appendFileSync('./.env', `\nLARGE_IMAGE_TEXT=${largeImageText}`);

    let smallImageText = readlineSync.question('Enter your small image text: ');
    fs.appendFileSync('./.env', `\nSMALL_IMAGE_TEXT=${smallImageText}`);

    let buttonsAnswer = readlineSync.keyInYN('Would you like to add some buttons?');
    if (buttonsAnswer) {
        let buttonAmount = readlineSync.question('How many buttons would you like to add? (Max 2): ');
        while (!/^\d+$/.test(buttonAmount) || buttonAmount > 2) {
            console.log('Invalid amount, please try again');
            buttonAmount = readlineSync.question('How many buttons would you like to add? (Max 2): ');
        }

        for (let i = 0; i < buttonAmount; i++) {
            let buttonLabel = readlineSync.question(`Enter button ${i + 1} label: `);
            let buttonUrl = readlineSync.question(`Enter button ${i + 1} url: `);
            fs.appendFileSync('./.env', `\nBUTTON_${i + 1}_LABEL=${buttonLabel}`);
            fs.appendFileSync('./.env', `\nBUTTON_${i + 1}_URL=${buttonUrl}`);
        }
    }

    require('dotenv').config();
    startPresence();
}

function startPresence() {
    const client = require('discord-rich-presence')(process.env.APPLICATION_ID);

    client.updatePresence({
        state: process.env.STATE,
        details: process.env.DETAILS,
        largeImageKey: process.env.LARGE_IMAGE_KEY,
        smallImageKey: process.env.SMALL_IMAGE_KEY,
        largeImageText: process.env.LARGE_IMAGE_TEXT,
        smallImageText: process.env.SMALL_IMAGE_TEXT,
        // buttons: [
        //     { label: process.env.BUTTON_1_LABEL, url: process.env.BUTTON_1_URL },
        // ]
        // check if 2 buttons are defined and if theres one only create one button
        buttons: process.env.BUTTON_1_LABEL && process.env.BUTTON_2_LABEL ? [
            { label: process.env.BUTTON_1_LABEL, url: process.env.BUTTON_1_URL },
            { label: process.env.BUTTON_2_LABEL, url: process.env.BUTTON_2_URL }
        ] : process.env.BUTTON_1_LABEL ? [
            { label: process.env.BUTTON_1_LABEL, url: process.env.BUTTON_1_URL }
        ] : undefined
    });
    //     buttons: process.env.BUTTON_1_LABEL ? [
    //         // check if button 1 is defined if not do not create the button
    //         { label: process.env.BUTTON_1_LABEL, url: process.env.BUTTON_1_URL },
    //         // use an if statement to check if button 2 is defined if not do not create the button
    //         process.env.BUTTON_2_LABEL ? { label: process.env.BUTTON_2_LABEL, url: process.env.BUTTON_2_URL } : null
    //     ] : undefined
    // });

    console.log('Presence started');
}