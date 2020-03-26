function updateCount(tabId, isOnRemoved) {
  browser.tabs.query({ currentWindow: true, hidden: false }).then(tabs => {
    let length = tabs.length;

    // onRemoved fires too early and the count is one too many.
    // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
    if (
      isOnRemoved &&
      tabId &&
      tabs
        .map(t => {
          return t.id;
        })
        .includes(tabId)
    ) {
      length--;
    }

    browser.browserAction.setBadgeText({ text: length.toString() });

    browser.browserAction.setBadgeBackgroundColor({ color: "lightgrey" });
  });
}

browser.tabs.onRemoved.addListener(tabId => {
  updateCount(tabId, true);
});
browser.tabs.onCreated.addListener(tabId => {
  updateCount(tabId, false);
});
updateCount();
