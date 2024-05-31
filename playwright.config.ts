import {devices, PlaywrightTestConfig} from '@playwright/test'
require('dotenv').config({path: '.env'});

const config: PlaywrightTestConfig = {
    testDir: 'tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: "https://restful-booker.herokuapp.com",
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
          },
        video: 'off',
        screenshot: 'off'
    },
    projects:[
        {
            name: 'Restful-booker'
        }
        // {
        //     name: 'Chromium',
        //     use: {browserName: 'chromium'}
        // },
        // {
        //     name: 'Firefox',
        //     use: {browserName: 'firefox'}
        // },
        // {
        //     name: 'Webkit',
        //     use: {browserName: 'webkit'}
        // }
    ],
    //executed before every single test
    //globalSetup: require.resolve('./global-setup')
}

export default config