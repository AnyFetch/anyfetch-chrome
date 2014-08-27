anyfetch-chrome
===============

AnyFetch Chrome extension

# How to work locally

1. `npm install`
2. `npm install -g gulp`
3. `gulp`

In order to add a local, unpacked extension to Chrome, go to your Extension management page. Activate the "Developer mode" and use the "Load unpacked extension" button.

# How to package the app

```
gulp package
```

A zip containing all the necessary files and folders is output at the project's root. Note that the version number is read from `package.json` and updated in `manifest.json` automatically.

The zip can be uploaded directly to the Webstore. To push the new version to the Chrome Webstore, follow [this procedure](https://developer.chrome.com/webstore/publish);
