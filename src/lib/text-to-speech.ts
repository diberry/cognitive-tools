const rp: any = require('requestretry');

export class TextToSpeech {
  // any settings for TTS such as language
  private config: any = {};

  // all required settings were sent
  private configWorks: boolean = false;

  // time delay between requests
  private delayMS: number = 500;

  // retry recount
  private retry: number = 5;

  /**
   * Example accessTokenHost = westus.api.cognitive.microsoft.com,
   * Example ttsHost - westus.tts.speech.microsoft.com
   * @param config - {accessTokenHost, ttsHost, ttsKey}
   */
  constructor(config) {
    if (config && config.accessTokenHost && config.ttsHost && config.ttsKey) {
      this.config = config;
      this.configWorks = true;
    }
  }

  // retry request if error or 429 received
  private retryStrategy = (err, response) => {
    let shouldRetry = err || response.statusCode === 429;

    return shouldRetry;
  };

  /**
   * Use accessTokenHost setting, passed in to constructor,
   * to get 10min access token used in bearer authentication header.
   */
  private getAccessToken = async () => {
    try {
      if (!this.configWorks) {
        throw Error("initialization failed, dependencies don't work");
      }

      const options = {
        method: 'POST',
        uri: `https://${this.config.accessTokenHost}/sts/v1.0/issueToken`,
        headers: {
          'Ocp-Apim-Subscription-Key': this.config.ttsKey,
        },
      };
      const response = await rp(options);

      return response.body;
    } catch (err) {
      throw err;
    }
  };
  // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support
  private getVoice() {
    return {
      gender: 'female',
      locale: 'en-us',
      code: 'Jessa24KRUS',
    };
  }
  // Make sure to update User-Agent with the name of your resource.
  // You can also change the voice and output formats. See:
  // https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
  /**
   * Convert text to speech and write to writeable stream
   * @param accessToken - good for 10 minutes, used immediately
   * @param transformConfig - ttsConfigs = {audioFileNameAndPath}
   * @param text
   * @param writableStream
   */
  async textToSpeech(accessToken, transformConfig, text, writableStream) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.configWorks) {
          throw Error("initialization failed, dependencies don't work");
        }

        if (!accessToken || !transformConfig || !text) {
          throw Error('initialization failed, one or more params are empty');
        }

        transformConfig.selectedVoice = this.getVoice();

        // Create the SSML request.
        let body = `<?xml version="1.0"?><speak version="1.0" xml:lang="en-us"><voice xml:lang="en-us" name="Microsoft Server Speech Text to Speech Voice (${transformConfig.selectedVoice.locale}, ${transformConfig.selectedVoice.code})"><prosody rate="-20.00%">${text}</prosody></voice></speak>`;

        let options = {
          method: 'POST',
          baseUrl: `https://${this.config.ttsHost}/`,
          url: '/cognitiveservices/v1',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'cache-control': 'no-cache',
            'User-Agent': 'YOUR_RESOURCE_NAME',
            'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
            'Content-Type': 'application/ssml+xml',
          },
          //timeout: 120000,
          body: body,
          maxAttempts: this.retry,
          retryDelay: this.delayMS,
          retryStrategy: this.retryStrategy,
        };

        // request has binary audio file
        rp(options)
          .pipe(writableStream)
          .on('finish', () => {
            resolve();
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Transform text to speech, speech returned in writeableStream.
   * @param transformConfig - settings for tts
   * @param text - text to convert
   * @param writeableStream - such as blob stream
   */
  public async transform(transformConfig, text, writableStream) {
    try {
      if (!this.configWorks) {
        throw Error("initialization failed, dependencies don't work");
      }

      if (!transformConfig || !text || !writableStream) {
        throw Error('initialization failed, one or more params are empty');
      }

      // get token - access token is good for 10 minutes
      const accessToken: any = await this.getAccessToken();

      if (!accessToken) {
        throw Error('accessToken is empty');
      }

      // get binary and return in in/out writableStream
      await this.textToSpeech(accessToken, transformConfig, text, writableStream);
    } catch (err) {
      throw err;
    }
  }
}
