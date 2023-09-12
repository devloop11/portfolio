export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
  ],
  "*.{css,scss,md}": ["prettier --write --ignore-unknown",
    "git add",]
};
