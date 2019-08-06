require('dotenv').config();
const TextAnalytics = require('./build/index').TextAnalytics;
const textAnalytics = new TextAnalytics({key: process.env.TEXTANALYTICSKEY, endpoint: process.env.TEXTANALYTICSSENDPOINT });

const text = "I'm an oak tree."

textAnalytics.detect(text).then(results=>{
    console.log(JSON.stringify(results.documents[0].detectedLanguages[0].name));
}).catch(err=>{
    console.log(err);
})

