import { defineConfig } from "cypress";
import admin from 'firebase-admin';
import { plugin as cypressFirebasePlugin } from 'cypress-firebase';
import serviceAccount from './serviceAccount.json' with {type: "json"};
import { ServiceAccount } from 'firebase-admin/lib/credential';

export default defineConfig({
  e2e: {
    supportFile: "tests/e2e/support/e2e.{js,jsx,ts,tsx}",
    specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}",
    videosFolder: "tests/e2e/videos",
    screenshotsFolder: "tests/e2e/screenshots",
    baseUrl: "http://localhost:8100",
    viewportWidth:375,
    viewportHeight: 667,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return cypressFirebasePlugin(on, config, admin, {
        projectId: "test-89223",
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
        databaseURL: "https://test-89223.firebaseio.com"
      });
    },
  },
});
