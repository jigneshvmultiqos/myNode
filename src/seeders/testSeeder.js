const { chromium } = require('playwright');
const { faker } = require('@faker-js/faker');

const numberOfRecords = 10;
module.exports = {
    run: () => {
        return new Promise(async (resolve) => {

            const browser = await chromium.launch();
            const recordsPromises = [];

            for (let i = 0; i < numberOfRecords; i++) {
                const context = await browser.newContext();
                const page = await context.newPage();

                // Navigate to the site URL with the contact form
                await page.goto('https://www.logicraysacademy.com/contact-us'); // Replace with your actual URL

                const fakeName = faker.fakeName();
                const fakeEmail = faker.internet.email();
                const fakeContact = faker.number.int({ min: 1000000000, max: 9999999999 }).toString();
                const fakeTechnology = 'PHP';

                // Fill the contact form
                await page.fill('input[name="name"]', fakeName);
                await page.fill('input[name="email"]', fakeEmail);
                await page.fill('input[name="phone"]', fakeContact);
                await page.selectOption('select[name="technology"]', { label: fakeTechnology });

                // Capture the response after form submission
                const [response] = await Promise.all([
                    page.waitForResponse(response => response.request().method() === 'POST'), // Adjust the method as per your form submission
                    page.click('button[type="click"]'),
                ]);

                // Logging the status and responseBody asynchronously
                recordsPromises.push((async () => {
                    const status = response.status();
                    console.log(`Record ${i + 1}: Form submission status - ${status}`);

                    const responseBody = await response.text();
                    console.log(`Record ${i + 1}: Response body - ${responseBody}`);

                    // Close the context for the current page
                    await context.close();
                })());
            }

            // Wait for all logging operations to complete
            await Promise.all(recordsPromises);

            // Close the browser after sending all records
            await browser.close();

            console.log('-------------- User data Added ------------------');
            resolve(true);
        });
    },
};

