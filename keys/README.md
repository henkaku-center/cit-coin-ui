# Key Files

> *Note:* _This folder contains sensitive key files. Do not commit any files from this directory._

The folder might contain key files for:

- GOOGLE SHEETS API
- GOOGLE IAM Service Account Credentials, etc.

If you want to encode keys to base64 format for setting it in an environment variable, you can check it with the
following command

**Example:**

```shell
yarn encode-keys --file keys/google-sheets-service-account.json
```