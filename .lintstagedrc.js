export default {
  "*.{js,jsx,ts,tsx,css,scss,json,md}": [
    "eslint --fix",
    "prettier --write --ignore-unknown",
    "git add",
  ],
};
