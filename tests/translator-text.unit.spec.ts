require('dotenv').config();
import { TranslatorText } from "../src/index";

describe('TranslatorText', () => {

    it('should detect and translate text', async (done) => {

        try {

            const text = "Hello World!";
            const languages =['de', 'it'];

            const config = { 
                'key': process.env.TRANSLATORKEY,
                'endpoint': process.env.TRANSLATORENDPOINT
            };
                
            const translatorText = new TranslatorText(config);

            const response = await translatorText.translate(text,languages);

            expect(response[0].detectedLanguage.language).toEqual("en");
            expect(response[0].translations.length).toEqual(2);  
            expect(response[0].translations[0].text).toEqual("Hallo Welt!" || "Salve, mondo!");            
            done();

        } catch (err) {
            done(err)
        }
    });
});