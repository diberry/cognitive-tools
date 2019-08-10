import request = require('request-promise');
import uuidv4 = require('uuid/v4');

export class TranslatorText {
  private config: any;

  /**
   *
   * @param config - {key:"",endpoint:""}
   */
  constructor(config) {
    this.config = config;
  }
  /**
   * config.endpoint needs to end in forward slash
   * @param text -
   * @param languages - array of strings of language acronyms
   */
  public async translate(text: string, languages: string[]): Promise<any> {
    try {
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
