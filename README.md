# CIT Coin UI

## Introduction

This is a CIT Coin Frontend project [Next.js](https://nextjs.org/) project
bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

これは、[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
でブートストラップされた CIT-Coin フロントエンド プロジェクト [Next.js](https://nextjs.org/)
プロジェクトです。

## Encoding Google API Keys:

This application needs
[`Google Service Account`](https://cloud.google.com/iam/docs/service-account-overview)
for running and accessing `Google Sheets` and `Google Firebase Database`.

If you want to encode keys to base64 format for setting it in an environment
variable, you can check it with the following command:

**Example:**

```shell
yarn encode-keys --file keys/google-sheets-service-account.json
```

## Running the Interface

We can simply run the `dev` command to run the Next.js app in the development mode. to build, We can run the `build`
command.

```shell
yarn dev # development server
yarn build
```

## External Links:

1. Spreadsheets API: https://developers.google.com/sheets/api/quickstart/js
2. 