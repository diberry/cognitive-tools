require('dotenv').config();
import { TextAnalytics } from "../src/index";

describe('TextAnalytics', () => {

    it('should detect language', async (done) => {

        try {

            const text = "I am an oak tree";

            const textAnalytics = new TextAnalytics({key: process.env.TEXTANALYTICSKEY, endpoint: process.env.TEXTANALYTICSSENDPOINT });

            const results = await textAnalytics.detect(text);

            expect(results.documents[0].detectedLanguages[0].name).toBe("English");
            expect(results.documents[0].detectedLanguages[0].iso6391Name).toBe("en");
            expect(results.documents[0].detectedLanguages[0].score).toBe(1);

            done();

        } catch (err) {
            done(err)
        }
    });
});