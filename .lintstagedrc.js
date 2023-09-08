export default {
  "*.{js,jsx,ts,tsx,css,scss,md}": [
    "eslint --fix",
    "prettier --write --ignore-unknown",
    "git add",
  ],
};
