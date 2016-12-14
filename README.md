# Stackoverflow Answer Preview for Mixmax

This is an open source Mixmax Link Resolver. See <http://developer.mixmax.com/docs/overview-link-resolvers> for more information about how to use this example code in Mixmax.

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl http://localhost:9146/resolver?url=http%3A%2F%2Fstackoverflow.com%2Fa%2F3055023
```

## To Add This Link Resolver to your Mixmax Account

1. Go to `https://app.mixmax.com/dashboard/settings/integrations`
2. Under 'Link Resolvers' hit 'Add Link Resolver'
    - Fill in 'Stackoverflow Answers' for Description
    - 'stackoverflow.com/a/[\d]+' for Regular Expression
    - 'http://localhost:9146/resolver' for Resolver API URL
3. Hit 'Add Link Resolver'!