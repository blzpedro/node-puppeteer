import puppeteer from 'puppeteer'
import fs from 'fs'

(async () => {

  if (process.argv.length < 3) {
    throw new Error("URL parameter is missing. Try to execute using -> node . ${url}. Pass the URL param using quotation marks")
  }

  const videoUrl = process.argv[2];

  console.log('Pay attention to add your extension path correctly!')
  
  const extensionPath = 'C:/Users/Pedro/AppData/Local/Google/Chrome/User Data/Default/Extensions/nmmicjeknamkfloonkhhcjmomieiodli/1.0.17_0'
  const browser = await puppeteer.launch({
    headless: 'new', // false
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  })
  const page = await browser.newPage()
  await page.goto(videoUrl, {
    waitUntil: 'domcontentloaded',
  })
  await page.bringToFront()
  const toggleSelector = '#yt_ai_summary_header_toggle'
  const summariesSelector = '.yt_ai_summary_transcript_text_segment'

  await page.waitForFunction(selector => {
    const element = document.querySelector(selector)
    return element && element.offsetWidth > 0 && element.offsetHeight > 0
  }, {}, toggleSelector)

  await page.click(toggleSelector);

  await page.waitForTimeout(1000)

  const noSummaryAvailable = await page.$x("//*[contains(text(), 'No Transcription')]");
  if (noSummaryAvailable.length > 0) {
    await browser.close()
    throw new Error("Transcriptions for this video isn't available yet.")
  }
  
  await page.waitForSelector(summariesSelector)

  const summary = await page.$$eval(summariesSelector, segments => {
    return segments.map(segment => segment.textContent)
  })

  const formattedSummary = summary.map(s => s).join('')
  fs.writeFileSync('transcript.txt', formattedSummary, 'utf8')
  console.log('Transcription created successfully!')

  await browser.close()

})()
