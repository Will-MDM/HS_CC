const puppeteer = require("puppeteer");

(async () => {
  try {
    //Get the browser instance based on your computer
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });

    //Data to input in JSON format
    const log = {
      name: "Makeinfo",
      domain: "makeinfo.co",
      description: "Tools for supporting your online selling",
      stack: "Angular, React, Hubspot, ",
      date: "2021-05-23",
    };

    let page = await browser.newPage();
    page.setViewport({ width: 800, height: 563 });

    /* Your Airtable form url. 
     You can get the URL from Share
     Config prefill_ based on your Airtable form values
     */
    let baseURL =
      "https://airtable.com/shrnaxBBbS4vJU1yh?prefill_Company%20Name=";

    await page.goto(
      baseURL +
        log.name +
        "&prefill_Company%20Domain=" +
        log.domain +
        "&prefill_Company%20Description=" +
        log.description +
        "&prefill_Tech%20Stack=" +
        log.stack +
        "&prefill_Date=" +
        log.date
    );

    await page.waitForSelector(
      ".form > .formContent > .formFieldAndSubmitContainer > .formSubmit > .submitButton"
    );
    await page.click(
      ".form > .formContent > .formFieldAndSubmitContainer > .formSubmit > .submitButton"
    );
    // await page.close();
    // await browser.close();
  } catch (err) {
    console.log(err);
  }
})();
