const CognitiveServicesCredentials: any = require('ms-rest-azure').CognitiveServicesCredentials;
const TextAnalyticsAPIClient: any = require('azure-cognitiveservices-textanalytics');

export class TextAnalytics {
  private client: any;

  /**
   *
   * @param config - {key:"",endpoint:""}
   */
  constructor(config) {
    const credentials: any = new CognitiveServicesCredentials(config.key);
    this.client = new TextAnalyticsAPIClient(credentials, config.endpoint);
  }
  public async detect(text: string) {
    try {
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
