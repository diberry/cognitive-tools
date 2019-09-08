require('dotenv').config();
import { TextToSpeech } from "../src/index";
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';  

describe('tts', () => {

    it('should return textToSpeech', async (done) => {

        try {
            jest.setTimeout(90000);


            const ttsConfig = {
                accessTokenHost: process.env.SPEECHACCESSTOKENHOST,
                ttsHost: process.env.SPEECHRESOURCETTSHOST,
                ttsKey: process.env.SPEECHRESOURCETTSKEY
            };

            const textToSpeech = new TextToSpeech(ttsConfig);

            const transformConfig = {
                audioFileNameAndPath: (+new Date).toString() + '-' + 'test.mp3'
            }

            // final file location
            let writableStream = fs.createWriteStream(transformConfig.audioFileNameAndPath);
            
            // text to speech
            await textToSpeech.transform(transformConfig, "This is a brand new world.", writableStream);

            //stream handling
            //writableStream.end();

            await fsPromises.access(transformConfig.audioFileNameAndPath, fs.constants.W_OK);

            // cleanup
            await fsPromises.unlink(transformConfig.audioFileNameAndPath);

            done();
    


        } catch (err) {
            done(err);
        }

    });
});
