import puppeteer from 'puppeteer'
import fs from 'fs'
import dotenv from 'dotenv'
import axios from 'axios'

(async () => {
  dotenv.config()
  const chatGptApiUrl = 'https://api.openai.com/v1/completions';
  const apiKey = process.env.OPENAI_API_KEY

  if (process.argv.length < 3) {
    throw new Error("URL parameter is missing. Try to execute using -> node . ${url}. Pass the URL param using quotation marks")
  }

  const videoUrl = process.argv[2];

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
  const videoTitleSelector = 'title'

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

  await page.waitForSelector(videoTitleSelector)

  const videoTitle = await page.$$eval(videoTitleSelector, title => title.map(t => t.textContent)[0])

  await browser.close()
  
  const formattedSummary = summary
  .map(s => s.trim())
  .filter(s => s.length > 0)
  .join(' ').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  
  const promptToAI = `Reescreva o título ${videoTitle} Mantenha ele entre 50 e 70 caracteres Use palavras que deem emoção a ele, e apele para algo surpreendente escreva 20 versões - Roteiro resuma o roteiro abaixo em português, e separe os principais tópicos abordados nele de forma detalhada em uma lista reescreva o trecho a seguir com outras palavras usando 50 palavras e de modo educativo e simples de entender: ${formattedSummary}`

  try {
    console.log('Waiting to generate script.')
    const response = await axios.post(
      chatGptApiUrl,
      {
        model: 'text-davinci-003',
        prompt: promptToAI,
        max_tokens: 2048
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const generatedText = response.data.choices[0].text;
    fs.writeFileSync('script_result.txt', generatedText, 'utf8')
    console.log('Script result generated successfully!')
  } catch (error) {
    console.error('Error sending request to ChatGPT API:', error);
  }
})()
