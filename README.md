# Comment Section

A small React comment section.

## Run it

```sh
npm install
npm run dev
```

## Candidate prompt

The comment section currently supports top-level comments and one level of replies. Extend it so a reply can itself have replies, with no fixed nesting depth. Keep the existing posting and like interactions working, and make the nesting clear in the interface.

Consider how you would represent the comment data, identify the parent comment when posting a reply, and render a tree of comments.