/* globals chrome */
import WebTorrent from 'webtorrent';
import Firebase from 'firebase';
Firebase.INTERNAL.forceWebSockets();
window.client = new WebTorrent();
window.fb = new Firebase('https://torrentia.firebaseio.com/');
chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('index.html', {
    bounds: {
      width: 1000,
      height: 800
    }
  });
});
