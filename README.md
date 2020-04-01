# 🌀 Teleporter

Teleporter is the fastest way to jump between open tabs in your web browser.

## Install

The extension currently can't be installed from Firefox Addons website or Chrome Web Store. You can [install it on Firefox with this link](https://github.com/bjesus/teleporter/releases/download/0.3.1/tab_teleporter-0.3.1-an+fx.xpi).

## How to use

1. Open the Teleporter panel using the "play" button in your keyboard
2. Filter through the list with the simple (fuzzy)search input box
3. Once there's only one result left, Teleporter will open it automatically
4. You can always type the tab number and Teleporter will open it even if more results are visible

## Configure activation button

If you really don't want to use the play button, you can configure any other key combination you want. Go to `about:addons`, and on the right of "Manage your extensions" open the cogs menu and choose "Manage Extensions Shortcuts". You can then pick any other regular shortcut you want.

## Why play button?

WebExtension requires two keys shortcuts [except for the keyboard media buttons](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/commands#Media_keys) that can be used alone. To be the fastest way to jump between tabs, Teleporter needs to be one click away. If you don't have the key in your keyboard, you'd need to set up some key remapping. On Linux, try editing `/usr/share/X11/xkb/symbols/inet` or `/usr/share/X11/xkb/symbols/evdev` and configure whatever key you want as `XF86AudioPlay`. I haven't tried it but it seems that you can use [Keyboard Layout Creator](https://www.microsoft.com/en-us/download/details.aspx?id=22339) on Windows and [Karabiner](https://karabiner-elements.pqrs.org/) on MacOS.

## Now I don't need my tab bar!

That's the point :) I found that not having my tabs visible all the time helps me focus. On Firefox you can hide it completely [by editing your userChrome.css](https://superuser.com/questions/1268732/how-to-hide-tab-bar-tabstrip-in-firefox-57-quantum). I don't know how to do it on other browsers.
