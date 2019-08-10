require('dotenv').config();
import { TextToSpeech } from "../src/index";
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';  

describe('tts', () => {

    it('should return textToSpeech', async (done) => {

        try {
            jest.setTimeout(25000);


            const ttsConfig = {
                accessTokenHost: process.env.SPEECHACCESSTOKENHOST,
                ttsHost: process.env.SPEECHRESOURCETTSHOST,
                ttsKey: process.env.SPEECHRESOURCETTSKEY
            };

            const textToSpeech = new TextToSpeech(ttsConfig);

            const transformConfig = {
                filenameandpath: 'test.mp3'
            }

            
            let writableStream = fs.createWriteStream(transformConfig.filenameandpath);
            await textToSpeech.transform(transformConfig, "This is a brand new world.", writableStream);

            //stream handling
            writableStream.end();

            await fsPromises.access(transformConfig.filenameandpath, fs.constants.W_OK);

            // cleanup
            await fsPromises.unlink(transformConfig.filenameandpath);

            done();
    


        } catch (err) {
            done(err);
        }

    });
});
