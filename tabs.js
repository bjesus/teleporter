const filterInput = document.getElementById("filterInput");

function updateList() {
  filterInput.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * listTabs to switch to
 */
function listTabs(filter) {
  let hidden = false;
  if (typeof filter === "string") {
    if (filter.startsWith("*")) {
      hidden = true;
      filter = filter.replace("*", "");
    }
  } else {
    filter = "";
  }
  browser.tabs.query({ currentWindow: true }).then((tabs) => {
    let tabsList = document.getElementById("tabs-list");
    let currentTabs = document.createDocumentFragment();
    let counter = Math.ceil(tabs.length / 10) + 2;

    tabsList.textContent = "";
    let matching = 0;

    let filteredTabs;
    if (filter) {
      fuzzySearch = fuzzysort.go(filter, tabs, { key: "title" });
      filteredTabs = fuzzySearch.map((o) => o.obj.id);
      tabs.sort(function (a, b) {
        try {
          return (
            fuzzySearch.find((t) => t.obj.id == b.id).score -
            fuzzySearch.find((t) => t.obj.id == a.id).score
          );
        } catch (e) {
          return true;
        }
      });
    } else {
      filteredTabs = tabs.map((t) => t.id);
    }

    for (const tab of tabs) {
      if (filteredTabs.includes(tab.id) && (hidden || !tab.hidden)) {
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
        tabImg.classList.add("favicon");
        if (tab.favIconUrl) {
          tabImg.setAttribute("src", tab.favIconUrl);
        } else {
          tabImg.setAttribute("src", "icons/defaultFavicon.svg");
        }
        tabHolder.appendChild(tabImg);

        let tabCode = document.createElement("span");
        tabCode.textContent = counter;
        tabHolder.appendChild(tabCode);

        let tabLink = document.createElement("a");
        tabLink.textContent = tab.title || tab.id;
        tabLink.setAttribute("href", tab.id);
        tabLink.classList.add("switch-tabs");
        tabHolder.appendChild(tabLink);

        let closeImg = document.createElement("img");
        closeImg.classList.add("closeButton");
        closeImg.setAttribute("src", "icons/close-icon.svg");
        closeImg.onclick = function (event) {
          const tabId = +event.target.previousSibling.getAttribute("href");
          browser.tabs.remove(tabId);
        };
        tabHolder.appendChild(closeImg);

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

document.onkeydown = function (event) {
  if (event.keyCode == 38) {
    const currentTab = document.getElementsByClassName("active-tab")[0];
    const prevTabId = +currentTab.previousSibling
      .getElementsByTagName("a")[0]
      .getAttribute("href");
    browser.tabs.update(prevTabId, {
      active: true,
    });
    setTimeout(function () {
      window.focus();
    }, 2000);
  }
  if (event.keyCode == 40) {
    const currentTab = document.getElementsByClassName("active-tab")[0];
    const nextTabId = +currentTab.nextSibling
      .getElementsByTagName("a")[0]
      .getAttribute("href");
    browser.tabs.update(nextTabId, {
      active: true,
    });
    setTimeout(function () {
      window.focus();
    }, 2000);
  }
};

browser.tabs.onCreated.addListener(updateList);
browser.tabs.onRemoved.addListener(updateList);
browser.tabs.onUpdated.addListener(updateList);

filterInput.oninput = async function () {
  const numbers = this.value.replace(/\D/g, "");
  if (numbers.length > 1) {
    if (numbers[0] === "0") {
      var xpath = "//span[text()='" + numbers.substring(1) + "']";
      // const tabId = +event.target.previousSibling.getAttribute("href");
      var matchingElement = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      const tabId = matchingElement.nextSibling.getAttribute("href");
      if (tabId) {
        browser.tabs.remove(+tabId).then((x) => {
          filterInput.value = "";
          listTabs("");
          filterInput.focus();
        });
      }
    } else {
      var xpath = "//span[text()='" + numbers + "']";
      var matchingElement = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      matchingElement.nextSibling.click();
    }
  } else {
    listTabs(this.value.replace(/[0-9]/g, ""));
  }
};

document.addEventListener("DOMContentLoaded", listTabs);

document.addEventListener("click", (e) => {
  var tabId = +e.target.getAttribute("href");

  browser.tabs
    .query({
      currentWindow: true,
    })
    .then((tabs) => {
      for (var tab of tabs) {
        if (tab.id === tabId) {
          browser.tabs.update(tabId, {
            active: true,
          });
          window.close();
        }
      }
    });
  e.preventDefault();
});
