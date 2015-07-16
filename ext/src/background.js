chrome.contextMenus.create({
  title: "Download with peer down",
  contexts: ["link"],
  onclick : function(e) {
    var laserExtensionId = "imdhcflccoepcfannjekmkhdagfcnedj";

    chrome.runtime.sendMessage(laserExtensionId, e.linkUrl,
      function(response) {
        console.log('got response', response);
      });
  }
});
