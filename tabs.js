function fuzzyMatch(pattern, str) {
  pattern = ".*" + pattern.split("").join(".*") + ".*";
  const re = new RegExp(pattern);
  return re.test(str);
}

/**
 * listTabs to switch to
 */
function listTabs(filter) {
  getCurrentWindowTabs().then(tabs => {
    let tabsList = document.getElementById("tabs-list");
    let currentTabs = document.createDocumentFragment();
    let counter = 0;
    console.log(filter);
    tabsList.textContent = "";
    let matching = 0;

    for (let tab of tabs) {
      if (
        typeof filter !== "string" ||
        fuzzyMatch(filter.toLowerCase(), tab.title.toLowerCase())
      ) {
        matching = matching + 1;
        let tabHolder = document.createElement("div");
        tabHolder.classList.add("tab-holder");
        if (tab.active) {
          tabHolder.classList.add("active-tab");
        }
        if (tab.attention) {
          tabHolder.classList.add("active-tab");
        }
        let tabImg = document.createElement("img");
        tabImg.setAttribute("src", tab.favIconUrl);
        tabHolder.appendChild(tabImg);

        let tabCode = document.createElement("span");
        tabCode.textContent = counter + 11;
        tabHolder.appendChild(tabCode);

        let tabLink = document.createElement("a");
        tabLink.textContent = tab.title || tab.id;
        tabLink.setAttribute("href", tab.id);
        tabLink.classList.add("switch-tabs");
        tabHolder.appendChild(tabLink);

        currentTabs.appendChild(tabHolder);
      }

      counter += 1;
    }

    tabsList.appendChild(currentTabs);
    if (matching == 1) {
      tabsList.getElementsByTagName("a")[0].click();
    }
  });
}

document.getElementById("filterInput").oninput = function() {
  const numbers = this.value.replace(/\D/g, "");
  console.log(numbers);
  if (numbers.length > 1) {
    var xpath = "//span[text()='" + numbers + "']";
    var matchingElement = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    matchingElement.nextSibling.click();
  } else {
    listTabs(this.value.replace(/[0-9]/g, ""));
  }
};

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true, hidden: false });
}

document.addEventListener("click", e => {
  var tabId = +e.target.getAttribute("href");

  browser.tabs
    .query({
      currentWindow: true
    })
    .then(tabs => {
      for (var tab of tabs) {
        if (tab.id === tabId) {
          browser.tabs.update(tabId, {
            active: true
          });
          window.close();
        }
      }
    });
  e.preventDefault();
});
