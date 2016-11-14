var JsAppVersion = "3.1.0";

var $createButton = $('#createButton');
var $createFormContainer = $('#createNewFields');
var $saveButton = $('#saveButton');
var $addButton = $('#addButton');
var $checkJsonButton = $('#jsonPostJsonInput');

var requestTimeout = 3000;
var currentList;
var currentSettings;
var clientid;
var clientsecret;
var authcode;
var authtoken;
var loggedIn = false;


(function() {

  if(window.location.search.includes("code"))
  {
    alert("COOL!");
    var querystring = window.location.search.subsstring(1);
    var querystrings = querystring.split('&');
    for(var i = 0; i < querystrings.length; i++)
    {
      if(querystrings[i].includes("code"))
      {
        authcode = querystring[i].split('=')[1];
        getTokenFromCode();
        break;
      }
    }
  }

  $("#smartthings-switch-listing").hide();

  if(localStorage.smartthings_token !== "" || currentSettings.smartthings_token !== undefined)
  {
    loggedIn = true;
    $("#smartthings-switch-listing").show();
    $("#smartthings-logon").hide();
  }


})();

function connectSmartthings()
{
  clientid = $("client-id-input").value;
  clientsecret = $("client-secret-input").value;

  if((clientid !== "" || clientid !== undefined)
      && (clientsecret !== "" || clientsecret !== undefined))
  {
    alert("redirecting");
    window.location.href = "https://graph.api.smartthings.com/oauth/authorize?response_type=code&client_id="
                            + clientid + "&scope=app&redirect_uri=venumx.github.io";
  }else {
    alert("SOMETHING WENT WRONG");
  }
}

function getTokenFromCode()
{
  var builduri = "https://graph.api.smartthings.com/oauth/token?"
                  + "grant_type=authorization_code"
                  + "&code=" + authcode
                  + "&client_id=" + clientid
                  + "&client_secret=" + clientsecret
                  + "&redirect_uri=venumx.github.io";
  var method = "POST";

  var req = new XMLHttpRequest();

  req.setRequestHeader("Content-Type: application/x-www-form-urlencoded");

  req.onload = function() {
    try {
        // Transform in to JSON
        var json = JSON.parse(this.responseText);

        // Read data
        authtoken = json.access_token;
        currentSettings.setItem('smartthings_token', authtoken);

        alert(authtoken);
      } catch(err) {
        console.log('Error parsing JSON response!');
      }
  };

  req.open(method, builduri);
  req.send();
}
