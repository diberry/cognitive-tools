Wrapper on top of Azure Cognitive Services

```
const TextAnalytics = require('cognitive-tools').TextAnalytics;
const textAnalytics = new TextAnalytics({key: process.env.TEXTANALYTICSKEY, endpoint: process.env.TEXTANALYTICSSENDPOINT });

const text = "I'm an oak tree."

textAnalytics.detect(text).then(results=>{
    console.log(JSON.stringify(results.documents[0].detectedLanguages[0].name));
}).catch(err=>{
    console.log(err);
})
```