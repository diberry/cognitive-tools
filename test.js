require('dotenv').config();
const TextAnalytics = require('cognitive-tools').TextAnalytics;
const textAnalytics = new TextAnalytics({key: process.env.TEXTANALYTICSKEY, endpoint: process.env.TEXTANALYTICSSENDPOINT });

const text = "I'm an oak tree."

textAnalytics.detect(text).then(results=>{
    
    const detectedLanguage = results.documents[0].detectedLanguages[0].name; 

    // "English"
    console.log((detectedLanguage));
}).catch(err=>{
    console.log(err);
})