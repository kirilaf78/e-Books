import * as dotenv from "dotenv";

async function globalSetup() {
  dotenv.config({
    path: `./env/.env.${process.env.TEST_ENV}`,
    override: false
  });
}

export default globalSetup;
