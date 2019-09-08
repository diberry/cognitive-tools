const CognitiveServicesCredentials: any = require('ms-rest-azure').CognitiveServicesCredentials;
const TextAnalyticsAPIClient: any = require('azure-cognitiveservices-textanalytics');

export class TextAnalytics {
  // Settings for Text Analytics object - {key, endpoint}
  private client: any;

  // all required settings were sent
  private configWorks: boolean = false;

  /**
   * Example endpoint: https://diberry-text-analytics.cognitiveservices.azure.com
   * @param config - {key:"",endpoint:""}
   */
  constructor(config) {
    if (config && config.key && config.endpoint) {
      //const credentials: any = new CognitiveServicesCredentials(config.key);
      this.client = new TextAnalyticsAPIClient(new CognitiveServicesCredentials(config.key), config.endpoint);

      if (this.client) {
        this.configWorks = true;
      }
    }
  }
  /**
   * Detect language from text. Assume 1 language only.
   * @param text - limit is 1000 characters
   */
  public async detect(text: string) {
    try {
      if (!this.configWorks) {
        throw Error("initialization failed, dependencies don't work");
      }

      if (!text) {
        throw Error('initialization failed, one or more params are empty');
      }

      // require format for API
      const inputDocuments = {
        documents: [{ id: '1', text }],
      };

      return await this.client.detectLanguage({
        languageBatchInput: inputDocuments,
      });
    } catch (err) {
      throw err;
    }
  }
}
