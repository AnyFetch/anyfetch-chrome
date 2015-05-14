# Contributing

## How to work locally

1. `npm install`
2. `npm install -g gulp`
3. `gulp`

The `gulp` command will automatically start watching for changes in your files and rebuild as necessary. Building compiles the LESS files to CSS and assemble the JavaScript modules into a single file using Browserify, and compiles the Jade views to the final HTML used by Chrome. Be careful, it can crash without notifications and lead to annoying bugs, in such case just restart it.

In order to add a local, unpacked extension to Chrome, go to your Extension management page (`chrome://extensions/`). Activate the "Developer mode" and use the "Load unpacked extension" button then choose the generated `extension/` directory.

>Note: As Chrome loads the extension live from this directory, changes made in the `assets/` directory will reflect in the browser as you reload a page from the extension with one exception: the background page being loaded once for each browsing session, you have to manually reload it by clicking the "Refresh (Ctrl + R)" link in the extension section of the extension management page.

## File structure

```
.
├── assets
│   ├── js              # Your Javascript code goes here, it is browserified.
|   |   └── config
|   |       └── sites   # Location specific configuration.
|   |                     See below for details.
│   ├── jade            # Templates for extension pages goes here.
│   ├── less            # LESS files, transcripted to CSS.
│   ├── manifest.json   # Extension properties, permissions, etc.
│   └── templates       # Mustache templates, used by the JS files.
│
├── images
│   └── icons           # Icons
│       └── extension   # Icons used only by Chrome (page action icons)
│
├── test                # Unit tests
│
├── extension           # Gulp generated extension
│                       # (choose this directory in Chrome)
│
├── package.json        # Don't forget to update these files when bumping
├── bower.json          # version
│
└── gulpfile.js         # Gulp configuration file 

```

## How to package the extension

1. Update the version number in the `bower.json`, `package.json` and `assets/manifest.json` files.
2. Run `gulp package`. A zip containing all the necessary files and folders is created at the project's root.
3. Commit the changes. The best is to commit only `package.json`, `bower.json` and `assets/manifest.json`, and to set the message to be only the version number (e.g. `v1.2.2`).
4. Run `git tag` to set a new tag to your commit (e.g. `git tag v1.2.2`)
5. Run `git push origin --tags` to push your changes and tags.


The zip can be uploaded directly to the Chrome Web Store.
To push the new version to the Chrome Web Store, follow [this procedure](https://developer.chrome.com/webstore/publish).

## How to make a new site configuration file

TODO.

You should probably try to guess how they work by reading the existing config files, because I'm lazy and it would take too much time to make a complete documentation about that.

## Interesting reads

- [Chrome extension architecture overview](https://developer.chrome.com/extensions/overview)
- [Browser actions](https://developer.chrome.com/extensions/browserAction) VS [Page actions](https://developer.chrome.com/extensions/pageAction)
