import request = require('request-promise');
import uuidv4 = require('uuid/v4');

export class TranslatorText {
  // settings to create translator object {key, endpoint}
  private config: any;

  // all required settings were sent
  private configWorks: boolean = false;

  /**
   * Example endpoint: https://api.cognitive.microsofttranslator.com
   * @param config - {key:"",endpoint:""}
   */
  constructor(config) {
    if (config && config.key && config.endpoint) {
      this.config = config;
      this.configWorks = true;
    }
  }
  /**
   * config.endpoint needs to end in forward slash
   * @param text -
   * @param languages - array of strings of language acronyms
   */
  public async translate(text: string, languages: string[]): Promise<any> {
    try {
      if (!this.configWorks) {
        throw Error("initialization failed, dependencies don't work");
      }

      if (!text || !languages || !(languages.length > 0)) {
        throw Error('initialization failed, one or more params are empty');
      }

      const options = {
        baseUrl: this.config.endpoint,
        body: [
          {
            text,
          },
        ],
        headers: {
          'Content-type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.config.key,
          'X-ClientTraceId': uuidv4().toString(),
        },
        json: true,
        method: 'POST',
        qs: {
          'api-version': '3.0',
          to: languages,
        },
        url: 'translate',
      };

      return await request(options);
    } catch (err) {
      throw err;
    }
  }
}
