// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');

dotenv.config(); 

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config=({// all config key value pair

  testDir: './tests',
  timeout: 30 *1000,
  expect:{
    timeout: 5000,
  },
  reporter: 'html',
 
  
  use: {
   browserName: 'chromium',
   headless:false,
    screenshot : "on",
  trace: "on",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    
  },

 
});

module.exports=config