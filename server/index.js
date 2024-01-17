const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
 
const PORT = 1337;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));


app.post('/get-screenshot', async (req, res) => {
	if(!req.body.url){
		res.send({
			success: false,
			error: "please provide the URL",
		});
		return
	}
    const { url } = req.body;

    try {
        const screenshotBuffer = await captureScreenshot(url); // function to capture screenshot using puppeteer and return base64 string of image output
        res.send({
            success: true,
            screenshot: screenshotBuffer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            error: 'Failed to capture screenshot.',
        });
    }
});

// Serve static files from the 'public' folder

async function captureScreenshot(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

	try {
        const page = await browser.newPage();

        await page.goto(url, { timeout: 5000, waitUntil: 'load' });

        // Customize screenshot options if needed
        const screenshotBuffer = await page.screenshot({ encoding: 'base64' });

        return `data:image/png;base64,${screenshotBuffer}`;
    } catch (error) {
        console.error('Error capturing screenshot:', error);
        throw error; // Re-throw the error to propagate it to the calling function
    } finally {
        await browser.close();
    }
}
http.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
