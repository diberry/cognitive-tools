const rp: any = require('requestretry');

export class TextToSpeech {
  private config: any;

  // time delay between requests
  private delayMS: number = 500;

  // retry recount
  private retry: number = 5;

  /**
   *
   * @param config - {key:"",endpoint:""}
   */
  constructor(config) {
    this.config = config;
  }

  // retry request if error or 429 received
  private retryStrategy = (err, response) => {
    let shouldRetry = err || response.statusCode === 429;

    return shouldRetry;
  };

  // Gets an access token.
  private getAccessToken = async () => {
    const options = {
      method: 'POST',
      uri: `https://${this.config.accessTokenHost}/sts/v1.0/issueToken`,
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.ttsKey,
      },
    };
    const response = await rp(options);

    return response.body;
  };
  // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support
  private getVoice() {
    let defaultValue = {
      gender: 'female',
      locale: 'en-us',
      code: 'Jessa24KRUS',
    };

    return defaultValue;
  }
  // Make sure to update User-Agent with the name of your resource.
  // You can also change the voice and output formats. See:
  // https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#text-to-speech
  /**
   *
   * @param accessToken - good for 10 minutes, used immediately
   * @param transformConfig - ttsConfigs
   * @param text
   * @param writableStream
   */
  private async textToSpeech(accessToken, transformConfig, text, writableStream) {
    try {
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
      await rp(options)
        .on('response', async (response: any) => {
          if (response.statusCode === 200) {
            writableStream.on('finish', () => {
              console.log('The end!');
            });
            response.pipe(writableStream);
          } else {
            throw Error('Response statusCode ' + response.statusCode);
          }
        })
        .on('error', err => {
          throw err;
        });
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param transformConfig
   * @param text
   */
  public async transform(transformConfig, text, writableStream) {
    try {
      // get token - access token is good for 10 minutes
      const accessToken: any = await this.getAccessToken();

      // get binary and return in in/out writableStream
      await this.textToSpeech(accessToken, transformConfig, text, writableStream);
    } catch (err) {
      throw err;
    }
  }
}
