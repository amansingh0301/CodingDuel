const puppeteer = require('puppeteer');
const credentials = require('./credentials.json');
var submission = require('./temp.js');
const fs = require('fs');
var handle = credentials.handle;
var password = credentials.password;


// handle the situation when the code entered is the same as some old submission,
// the page won't redirect to submitted solutions page

async function getVerdictUtil(page) {
    const verdictWrapper = await page.evaluateHandle(() => document.querySelector('.submissionVerdictWrapper'));
    const verdictAccepted = await page.evaluateHandle(() => document.querySelector('.verdict-accepted'));
    const verdictRejected = await page.evaluateHandle(() => document.querySelector('.verdict-rejected'));

    const resultHandle = await page.evaluateHandle(body => body.innerHTML, verdictAccepted);
    const text1 = await page.evaluateHandle(body => body.innerText, verdictAccepted);
    const text2 = await page.evaluateHandle(body => body.innerText, verdictRejected);
    const text3 = await page.evaluateHandle(body => body.innerText, verdictWrapper);
    const resultHandle2 = await page.evaluateHandle(body => body.innerHTML, verdictWrapper);
    const resultHandle3 = await page.evaluateHandle(body => body.innerHTML, verdictRejected);
    console.log("HERE ", text1._remoteObject.value)
    console.log("HERE ", text2._remoteObject.value)
    console.log("HERE ", text3._remoteObject.value)
    console.log(await resultHandle.jsonValue());
    console.log(await resultHandle2.jsonValue());
    console.log(await resultHandle3.jsonValue());

}

async function getVerdict() {

    // const browser = await puppeteer.launch({
    //     ignoreDefaultArgs: true,
    //     args: ['--disable-features=ImprovedCookieControls', /*'--no-sandbox'*/],
    //     executablePath: '/usr/bin/google-chrome-stable',
    //     headless: true
    // });
    const browser = await puppeteer.launch({
        //ignoreDefaultArgs: true,
        args: ['--disable-features=ImprovedCookieControls', /*'--no-sandbox'*/],
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true
    });

    const page = await browser.newPage();

    const savedCookies = fs.readFileSync("userCookies.json");
    const parsedCookies = JSON.parse(savedCookies);
    if (parsedCookies !== 0) {
        for (var cookie of parsedCookies)
            await page.setCookie(cookie);
    }
    console.log("Session had been loaded");

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36');


    await page.goto('https://codeforces.com/problemset/status?my=on');
    await page.waitForSelector(".submissionVerdictWrapper");
    await getVerdictUtil(page);

    await browser.close();



}

async function login() {
    //const browser = await puppeteer.launch();
    // const browser = await puppeteer.launch({
    //     args: ['--no-sandbox'],
    //     headless: true,
    // });

    // const browser = await puppeteer.launch({
    //     ignoreDefaultArgs: true,
    //     args: ['--disable-features=ImprovedCookieControls', /*'--no-sandbox'*/],
    //     executablePath: '/usr/bin/google-chrome-stable',
    //     headless: true
    // });
    const browser = await puppeteer.launch({
        args: ['--disable-features=ImprovedCookieControls'],
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true
    });



    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36');

    await page.goto('https://codeforces.com/enter');
    await page.type('#handleOrEmail', handle);
    await page.type('#password', password);
    await page.click('.submit')
    const cookiesObject = await page.cookies();
    fs.writeFileSync("userCookies.json", JSON.stringify(cookiesObject));
    await page.waitForNavigation()
    await page.screenshot({ path: 'login.png' });
    await browser.close();
}

async function submit() {

    const browser = await puppeteer.launch({
        //ignoreDefaultArgs: true,
        args: ['--disable-features=ImprovedCookieControls', /*'--no-sandbox'*/],
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true
    });

    const page = await browser.newPage();

    // loading user cookies in current session
    const savedCookies = fs.readFileSync("userCookies.json");
    const parsedCookies = JSON.parse(savedCookies);
    if (parsedCookies !== 0) {
        for (var cookie of parsedCookies) await page.setCookie(cookie);
    }
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36');

    // await page.setViewport({ width: 1366, height: 768 });

    await page.goto('https://codeforces.com/problemset/submit');

    await page.waitForSelector('input[type=file]');
    await page.waitForSelector('input[name=submittedProblemCode]');
    await page.waitForSelector('input[type=submit]');
    await page.waitFor(1000);
    // await page.waitForNavigation({
    //     waitUntil: 'networkidle0',
    // });
    await page.type('input[name=submittedProblemCode]', "1422B");
    await page.screenshot({ path: "afterProblemCode.png" })

    const inputUploadHandle = await page.$('input[type=file]');
    let fileToUpload = './code.cpp';
    inputUploadHandle.uploadFile(fileToUpload);

    await page.screenshot({ path: 'afterSolution.png' });

    await page.click('input[type=submit]')
    await page.waitFor(5000);
    // await page.waitForNavigation({
    //     waitUntil: 'networkidle0',
    // });
    await page.screenshot({ path: 'afterClickingSubmit.png' });

    await page.waitFor(10000)
    // await page.waitForNavigation({
    //     waitUntil: 'networkidle0',
    // });

    await browser.close();
}

async function main() {
    await login();
    await submit();
    await getVerdict();
}

main();





