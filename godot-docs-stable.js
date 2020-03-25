'use strict'

/**
 * The stable version of Godot that we want the docs for.
 */
const stableVersion = '3.2';

/**
 * The regex used to test the url.
 */
const regex = /\d+(\.\d+)+/g;

/**
 * Defines the filters that will be used when the `tabs.onUpdated` event is called.
 * 
 * In this case, we only want to do something if we are on the docs.godotengine.org domain.
 */
const filter = {
  urls: ["*://*.docs.godotengine.org/*"],
  windowId: browser.windows.WINDOW_ID_CURRENT
};

/**
 * If we successfully update the tab to the new doc version we just log a success message, for now.
 * 
 * @param {Object} tab The info about the tab that the navigation occurred on.
 */
function onComplete(tab) {
  console.log(`Successfully navigated to the docs of the stable version of Godot.`);
}

/**
 * If we cannot successfully update the tab to the new doc version we log the reason why.
 * 
 * @param {Error} error The error encountered while trying to change the url.
 */
function onError(error) {
  console.log(`Error: ${error}`);
}

/**
 * When the `tabs.onUpdate` event is fired and it matches the filter this handler is used to check
 * if the user is on an older version of the docs and if so it redirects them to the stable version.
 * 
 * @param {number} tabId The id of the tab that the event was fired in.
 * @param {Object} changeInfo The attributes that changed between the last update call and now.
 * @param {Object} tabInfo Extra information about the current tab.
 */
function handleUpdated(tabId, changeInfo, tabInfo) {
  // To avoid an infinite loop of loading we don't want to try to redirect if the tab is loading.
  if (tabInfo.status == 'loading') return;

  const match = tabInfo.url.match(regex)[0];

  if (!match || match === stableVersion) return;

  const newUrl = tabInfo.url.replace(match, stableVersion);

  const updating = browser.tabs.update(tabId, {
    url: newUrl,
  });

  updating.then(onComplete, onError);
}

browser.tabs.onUpdated.addListener(handleUpdated, filter);