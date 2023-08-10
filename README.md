## YouTube Video Transcription Downloader using YouTube Summary with ChatGPT & Claude extension

Extension URL: https://chrome.google.com/webstore/detail/youtube-summary-with-chat/nmmicjeknamkfloonkhhcjmomieiodli

## Usage

1. Install Node.js v18.17.0 on your machine.
2. Clone this repository.
   ```sh
   git clone https://github.com/blzpedro/node-puppeteer.git
   cd node-puppeteer
3. Change your extension path(make sure that you are already have the extension installed):

   Go to line 14 and change the value from the constant extensionPath with your directory path where your extension is installed. 

   Normally would be: 
   C:/Users/${your_user}/AppData/Local/Google/Chrome/User Data/Default/Extensions/nmmicjeknamkfloonkhhcjmomieiodli/1.0.17_0
4. Install dependencies:

   ```sh
   npm install

   After installing the dependencies, enter in your node_modules/pupppeteer then do another 
   npm install to install the Chromium correctly.
5. Install dependencies:

   ```sh
   npm install

   After installing the dependencies, enter in your node_modules/pupppeteer then do another 
   npm install to install the Chromium correctly.

6. Create a .env file with the variable:

    Note: this variable need to be created here -> https://platform.openai.com/account/api-keys

   ```sh
   OPENAI_API_KEY=?
7. Start the script:

   ```sh
   node . "VIDEO_URL"
8. After a successful execution you can note that a file called "script_result.txt" was created in your directory.