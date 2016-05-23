var JsAppVersion = "3.1.0";

var $createButton = $('#createButton');
var $createFormContainer = $('#createNewFields');
var $saveButton = $('#saveButton');
var $addButton = $('#addButton');
var $checkJsonButton = $('#jsonPostJsonInput');

var requestTimeout = 3000;
var currentList;
var currentSettings;
var currentIndex = null;
var newEntry = false;


(function() {

  crossDomainPost();


  document.getElementById('createNewFields').style.display = "none";
  document.getElementById('JsonPostFields').style.display = "none";
  //$('#validationFeedbackLabel').hide();
  $('.tooltip-background').hide();
  $('.update-background').hide();
  $('.hamburger-img').hide();
  $('.hamburger-label').hide();
  //$('#framer').attr('src','https://www.google.com');


  //fetchFromPebble();


  $(".more_info").click(function () {
      var $title = $(this).find(".title");
      if (!$title.length) {
          $(this).append('<span class="title">' + $(this).attr("title") + '</span>');
      } else {
          $title.remove();
      }
  });

  // Supply the number of hearts in the about fields
  $.ajax( {
    type: "GET",
    url: "http://pblweb.com/api/v1/hearts/567af43af66b129c7200002b.json",
    error: function(xhr, statusText) { $('#heartsLabel').html('Oops. Something went wrong.') },
    success: function(msg){ $('#heartsLabel').html(msg["hearts"])}
  });

  $('#testResultsContainer').hide();
  $('#backupFields').hide();
  $('#reportFields').hide();
  $('#aboutFields').hide();
  $('#settingsFields').hide();
  $('#donateFields').hide();
  $('#changelogFields').hide();
  $('#getFrame').hide();
  $('#createNewFolderFields').hide();
//<img src="/images/folder_demo.gif" dynsrc="/images/folder_demo.gif" loop=infinite alt="Folder and dragging demo">
  $("#update-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">NEW VERSION AVAILABLE</a><br><a style="color:black;">HTTP-Push has been updated to version 3.1.0. To apply new version, download the HTTP-PUSH app from the Pebble apple store.</a><br/><br/><a style="font-weight: bold;font-size:14px">NEW FEATURES</a><br><a style="color:black;"><ul style=\"padding-left:20px\"><li>Vibration length now configurable</li><li>Restore requests from backup</li><li>Report bugs</li><li>View changelogs</li><li>Fixed crashing when request size too large</li><li>Fixed crash when assigning multiple nested folders</li></ul></a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.update-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.update-background').hide();
    }
  });

  $("#vibration-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">VIBRATION LENGTH</a><br><a style="color:black;">Select how long vibrations last when receiving a response from a HTTP request. Select from 100, 300, and 500 milliseconds. Optionally, vibtrations can be disabled by selecting 0 milliseconds.</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.update-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.update-background').hide();
    }
  });


  $("#backup-save-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">SAVE BACKUP DATA</a><br><a style="color:black;">Copy the entire text from the \"COPY DATA\" field and save it to any location. You may save the text to your phone in a notepad, email it to yourself, save it to your server, and so on. The data can be pasted in the \"LOAD DATA\" field later to restore the request list from text.</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });
  $("#donate-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">FOR THE COMMUNITY</a><br><a style="color:black;">Support the developers of HTTP-PUSH. The app is made completely free by the community and for the community. Consider motivating the developers by supplying coffee and beer!</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });
//[{"type":"folder","name":"Living Room","list":[{"type":"request","name":"Lights","endpoint":"http://10.0.0.1:8090/livingroomlights","json":"","method":"GET","toDelete":false}],"toDelete":false}]
    $("#backup-load-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">LOAD BACKUP DATA</a><br><a style="color:black;">Paste the data as text into the \"LOAD DATA\" field and press the \"Load Data\" button to restore your data. An alert will be displayed if the format of the text entered is invalid.</a><br><br><a style="font-weight: bold;font-size:14px">EXAMPLES</a><br><a style="color:black;">[{"type":"folder", "name":"Living Room", "list":[{"type":"request", "name":"Lights", "endpoint":"http://10.0.0.1:8090/livingroomlights", "json":"", "method":"GET", "toDelete":false}], "toDelete":false}]</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  $("#report-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">REPORT A BUG</a><br><a style="color:black;">Contact the developer of HTTP-PUSH about any issue you\'ve encountered. Currently the only method to contact the developer is through email. Keep in mind that the more details you can provide about the problem, the easier it is to fix the issue.</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  $("#reorder-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a><br><br><a style="font-weight: bold;font-size:14px">EXAMPLES</a><br><a id="amazing"></a><img id="reorder-demo">',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
      //this.update('<a style="font-weight: bold;font-size:14px">REORDER LIST</a><br><a style="color:black;">Drag and drop your HTTP requests in the order you want them to appear on your Pebble. Place requests into folders to organize your list. You can also place folders within folders.</a>');
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  //Preload the preloader gif
  

  $("#folder-name-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">FOLDER DISPLAY NAME</a><br><a style="color:black;">Enter the name of the folder that will be displayed on your pebble. Shorten as necessary so that it fits on your pebble screen. Maximum length is 30 characters.</a><br><br><a style="font-weight: bold;font-size:14px">EXAMPLES</a><br><a style="color:black;">Living Room<br>Kitchen<br>Sound System</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'fade',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  $("#template-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">TEMPLATE SELECTION</a><br><a style="color:black;">Populate the fields below with the values of an existing request. Use this option to avoid having to enter the same values over and over.</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'slide',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });


  $("#request-name-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">REQUEST DISPLAY NAME</a><br><a style="color:black;">Enter the name of the request that will be displayed on your pebble. Shorten as necessary so that it fits on your pebble screen. Maximum length is 30 characters.</a><br><br><a style="font-weight: bold;font-size:14px">EXAMPLES</a><br><a style="color:black;">Open the Garage Door<br>Feed Fish<br>Volume Up<br>Toggle TV</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'slide',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  $("#request-type-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">REQUEST TYPE</a><br><a style="color:black;">Select the http method that is used for the request. HTTP POST and PUT includes an additional input field for JSON data.</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'slide',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  $("#endpoint-url-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">REQUEST ENDPOINT URL</a><br><a style="color:black;">An HTTP GET request will be sent to the URL entered above. Ensure that the webserver is listening on the port and context specified.</a><br><br><a style="font-weight: bold;font-size:14px">EXAMPLES</a><br><a style="color:black;">http://1.1.1.1:81/example.aspx<br>http://myhomepage.com/ws.do</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'slide',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });

  $("#json-tooltip").simpletip({
    fixed: true,
    content: '<a style="font-weight: bold;font-size:14px">JSON DATA INPUT</a><br><a style="color:black;">Enter the JSON content as a string. Check the formatting of your input by clicking "Check Format". When checking format, the input field will flash green to indicate that the input is valid. Red indicates invalid JSON formatting. Whitespace is ignored.<br><br>Use the format below:<br>{<br>  "key" : "value",<br>  "key" : "value",<br>    ...<br>  }</a><br><br><a style="font-weight: bold;font-size:14px">EXAMPLES</a><br><a style="color:black;">{"mode":"signal","state":"on","channel":"tv"}<br>{"environment":"test","start":true,"device":"tv"}</a>',
    position: [0,'0'],
    persistent: true,
    showEffect: 'slide',
    hideEffect: 'none',
    onShow: function () {
      $('.tooltip-background').show();
    },
    onHide: function () {
      $('.tooltip-background').hide();
    }
  });
          

  $( "#templateList" )
    .change(function () {
      var selectedID = document.getElementById("templateList").options[document.getElementById("templateList").selectedIndex].id;
      var entryData = extractData(selectedID);

      $('#displayedName').val(entryData["name"]);
      $('#httpGetUrlInput').val(entryData["endpoint"]);
      $('#jsonPostJsonInput').val(entryData["json"]);


      $('#GET').removeClass("active");
      $('#PUT').removeClass("active");
      $('#POST').removeClass("active");
      $('#'+entryData["method"]).trigger("click");
      $('#'+entryData["method"]).addClass("active");

  });


  /*
  Setting up the DD list
  */

  var updateOutput = function(e)
  {
      var list   = e.length ? e : $(e.target),
          output = list.data('output');
      if (window.JSON) {
          output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
      } else {
          output.val('JSON browser support required for this demo.');
      }
  };

  // activate Nestable for list 1
  $('#nestable').nestable({
      group: 1,
      noDragClass     : 'dd-nodrag',
  expandBtnHTML   : '<button class="dd-action" data-action="expand" type="button"><i class="glyphicon glyphicon-chevron-right glyphicon-offset"></i></button>',
  collapseBtnHTML : '<button class="dd-action" data-action="collapse" type="button"><i class="glyphicon glyphicon-chevron-down glyphicon-offset"></i></button>',
  customActions   : {
    'remove'    : function(item,button) {
      if( item.hasClass('dd-deleted') ) {
        item.data('isDeleted',false).removeClass('dd-deleted');
        button.html('<i class="glyphicon glyphicon-remove glyphicon-offset"></i>');
      }
      else {
        item.data('isDeleted',true).addClass('dd-deleted');
        button.html('undo');
      }
    }
  }
  })
  .on('change', updateOutput);

  var updateList = [];

  // output initial serialised data
  updateOutput($('#nestable').data('output', $('#nestable-output')));

  initData();
  generateLists();

  if (currentList.length < 1) {
    //$("#reorderFields").hide();
  }
  //$("button[title='Remove']").hide();

/*
  $('#nestable').on('change', function() {

    $('.dd-list').children('.dd-item').each(function() {
      console.log("Checking: " + this.getAttribute('data-id').toString());
      if ($(this).hasClass('dd-nonest')) {
        console.log ('Appending Request');

      } else {
        console.log ('Folder!');
      }
    });   

  });

*/

})();


function crossDomainPost() {
  // Add the iframe with a unique name
  var iframe = document.createElement("iframe");
  var uniqueString = "CHANGE_THIS_TO_SOME_UNIQUE_STRING";
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.contentWindow.name = uniqueString;

  // construct a form with hidden inputs, targeting the iframe
  var form = document.createElement("form");
  form.target = uniqueString;
  form.action = "http://pblweb.com/api/v1/hearts/567af43af66b129c7200002b.json";
  form.method = "POST";

  // repeat for each parameter
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "INSERT_YOUR_PARAMETER_NAME_HERE";
  input.value = "INSERT_YOUR_PARAMETER_VALUE_HERE";
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

function testingItOut() {
}


function generateRequestList(currentList) {
  var currentLevelList = [];

  for (var i=0; i < currentList.length; i++) {
    if (currentList[i]["children"] === undefined) { // request
      currentLevelList.push(currentList[i])
    } else { // if folder
      var nextList = generateRequestList(currentList[i]["children"]);
      for (var o=0; o < nextList.length; o++) {
        currentLevelList.push(nextList[o]);
      }
    }
  }
  return currentLevelList;
}

function generateTemplates(){
  $('#templateList').empty();
  console.log(JSON.stringify($('#nestable').nestable('serialize')));
  var serializedRequestList = generateRequestList($('#nestable').nestable('serialize'));

  console.log(JSON.stringify(serializedRequestList));

  var newTemplateEntry = document.createElement('option');
  newTemplateEntry.className = 'item-select-option';
  newTemplateEntry.id = "select";
  if (currentList.length == 0 || currentList == null) {
    newTemplateEntry.innerHTML = "No templates to choose from";
  } else { 
    newTemplateEntry.innerHTML = "Select a template";
  }
  $('#templateList').append(newTemplateEntry);

  for (var i=0; i < serializedRequestList.length; i++) {
    var newTemplateEntry = document.createElement('option');
    newTemplateEntry.id = serializedRequestList[i]['id'];
    newTemplateEntry.className = 'item-select-option';
    newTemplateEntry.innerHTML = serializedRequestList[i]['name'];
    $('#templateList').append(newTemplateEntry);
  }
}

function generateRequestHtml(entryName,entryId,parentNode,markDeleted) {
  var liClassName = "dd-item dd-nonest";

  if (markDeleted) {
    liClassName = liClassName + " dd-deleted";
  }

  var newLi = document.createElement('li');
  newLi.setAttribute("class", liClassName);
  newLi.setAttribute("data-id", entryId);
  $(newLi).data('name',entryName);

  var newRemoveButton = document.createElement('button');
  newRemoveButton.setAttribute("class", "dd-action pull-right");
  newRemoveButton.setAttribute("type", "button");
  newRemoveButton.setAttribute("data-action", "remove");
  newRemoveButton.setAttribute("title", "Remove");

  var newRemoveIcon = document.createElement('i');
  newRemoveIcon.setAttribute("class", "glyphicon glyphicon-remove glyphicon-offset");

  var newModifyButton = document.createElement('button');
  newModifyButton.setAttribute("class", "dd-action pull-right");
  newModifyButton.setAttribute("type", "button");
  newModifyButton.setAttribute("title", "Modify");

  newModifyButton.onclick = function modifyLabelOnClick () {
    var thisIndex = this.parentNode.getAttribute("data-id");
    showCreateDisplay(thisIndex);
  }

  var newModifyIcon = document.createElement('i');
  newModifyIcon.setAttribute("class", "glyphicon glyphicon-cog glyphicon-offset");

  var newHandle = document.createElement('div');
  newHandle.setAttribute("class", "dd-handle");
  newHandle.innerHTML = entryName;

  if (markDeleted) {
    newRemoveButton.innerHTML = 'undo';
    $(newLi).data('isDeleted',true);
  } else {
    newRemoveButton.appendChild(newRemoveIcon);  
  }
  newModifyButton.appendChild(newModifyIcon);

  newLi.appendChild(newRemoveButton);
  newLi.appendChild(newModifyButton);
  newLi.appendChild(newHandle);

  parentNode.append(newLi);

}

function generateFolderHtml(folderName,folderId,parentNode,markDeleted){
  var liClassName = "dd-item";

  if (markDeleted) {
    liClassName = liClassName + " dd-deleted";
  }

  var newLi = document.createElement('li');
  newLi.setAttribute("class", liClassName);
  newLi.setAttribute("data-id", folderId);

  var newRemoveButton = document.createElement('button');
  newRemoveButton.setAttribute("class", "dd-action pull-right");
  newRemoveButton.setAttribute("type", "button");
  newRemoveButton.setAttribute("data-action", "remove");
  newRemoveButton.setAttribute("title", "Remove");

  var newRemoveIcon = document.createElement('i');
  newRemoveIcon.setAttribute("class", "glyphicon glyphicon-remove glyphicon-offset");

  var newModifyButton = document.createElement('button');
  newModifyButton.setAttribute("class", "dd-action pull-right");
  newModifyButton.setAttribute("type", "button");
  newModifyButton.setAttribute("title", "Modify");

  newModifyButton.onclick = function modifyLabelOnClick () {
    var thisIndex = this.parentNode.getAttribute("data-id");
    showCreateDisplay(thisIndex);
  }

  var newModifyIcon = document.createElement('i');
  newModifyIcon.setAttribute("class", "glyphicon glyphicon-cog glyphicon-offset");

  var newExpandButton = document.createElement('button');
  newExpandButton.setAttribute("class", "dd-action");
  newExpandButton.setAttribute("data-action", "expand");
  newExpandButton.setAttribute("type", "button");
  newExpandButton.setAttribute("id", "custom");

  var newExpandIcon = document.createElement('i');
  newExpandIcon.setAttribute("class", "glyphicon glyphicon-chevron-right glyphicon-offset");

  var newCollapseButton = document.createElement('button');
  newCollapseButton.setAttribute("class", "dd-action");
  newCollapseButton.setAttribute("data-action", "collapse");
  newCollapseButton.setAttribute("type", "button");
  newCollapseButton.setAttribute("id", "custom");

  var newCollapseIcon = document.createElement('i');
  newCollapseIcon.setAttribute("class", "glyphicon glyphicon-chevron-down glyphicon-offset");


  var newFolderIcon = document.createElement('i');
  newFolderIcon.setAttribute("class", "glyphicon glyphicon-folder-open glyphicon-offset");
  newFolderIcon.style = 'padding-left: 5px;';

  var newHandle = document.createElement('div');
  newHandle.setAttribute("class", "dd-handle");
  newHandle.innerHTML = "<i class='glyphicon glyphicon-folder-open glyphicon-offset'></i>" + "    " +folderName;

  var newOl = document.createElement('ol');
  newOl.setAttribute("class","dd-list");

  if (markDeleted) {
    newRemoveButton.innerHTML = 'undo';
    $(newLi).data('isDeleted',true);
  } else {
    newRemoveButton.appendChild(newRemoveIcon);  
  }
  
  newModifyButton.appendChild(newModifyIcon);


  newExpandButton.appendChild(newExpandIcon);
  newCollapseButton.appendChild(newCollapseIcon);

  newLi.appendChild(newRemoveButton);
  newLi.appendChild(newModifyButton);
  
  newLi.appendChild(newExpandButton);
  newLi.appendChild(newCollapseButton);

  newLi.appendChild(newHandle);
  newLi.appendChild(newOl);

  //newHandle.appendChild(newFolderIcon);

  parentNode.append(newLi);


  return $(newOl);

}

function generateList(parentNode,nextList,ddIndex) {

  for (var i=0; i < nextList.length; i++) {
    var markDelete = nextList[i]["toDelete"];
    if (nextList[i]["type"] == null ||     //If null, mean's it's before folders 
      nextList[i]["type"] == 'request') {  //feature was added. And should be 
                                              //treated as a request
      //createListHtml(nextList[i]["name"],i);
      generateRequestHtml(nextList[i]["name"],(ddIndex?ddIndex+"-":"") + i.toString(),parentNode,markDelete);
    } else if (nextList[i]["type"] == 'folder'){
      var nextRoot = null;
      if (nextList[i]["list"] === undefined || nextList[i]["list"] == []) {
        nextRoot = generateFolderHtml(nextList[i]["name"],(ddIndex?ddIndex+"-":"") + i.toString(),parentNode,markDelete);
      } else {
        nextRoot = generateFolderHtml(nextList[i]["name"],(ddIndex?ddIndex+"-":"") + i.toString(),parentNode,markDelete);
      }

      $('button[data-action=expand]').hide();
      //$('button[data-action=collapse]').hide();

      //createListHtml("(Folder) " + nextList[i]["name"],i);
      var nestedList = nextList[i]["list"];

      console.log("going to consume folder content: " + JSON.stringify(nestedList));

      generateList(nextRoot,nestedList,(ddIndex?ddIndex+"-":"") + i.toString());
    }
  }
}

function generateLists(){

  var rootNode = $('#dd-root');

  rootNode.empty();
  $('.item.addNewButton').remove();

  console.log("Current List at Root!:")
  console.log(JSON.stringify(currentList));

  generateList(rootNode,currentList,"");

/*

  $('.item-draggable-list').empty();
  $('.item.addNewButton').remove();
  for (var i=0; i < currentList.length; i++) {

    
    if (currentList[i]["type"] == null ||     //If null, mean's it's before folders 
      currentList[i]["type"] == 'request') {  //feature was added. And should be 
                                              //treated as a request
      createRequestHtml(currentList[i]["name"],i);
    } else if (currentList[i]["type"] == 'folder'){

      createRequestHtml(currentList[i]["name"],i);
      var nestedList = currentList[i]["list"];

      for (var o=0; o < nestedList.length; o++) {
        createRequestHtml(nestedList,o);
      }
    }
    $('#reorderList').nestable({ });
  }
  */

  // Reload slate to enable dynamic content 

}

function extractData(indexString) {
  var indexArray = indexString.split("-");
  var currentListIndex = JSON.parse(JSON.stringify(currentList));

  for (var i=0; i < indexArray.length; i++) {
    if (currentListIndex["type"] == "folder") {
      currentListIndex = currentListIndex["list"][parseInt(indexArray[i])]; 
    }
    else {
      currentListIndex = currentListIndex[parseInt(indexArray[i])]; 
    }
  }

  //console.log("Extract returning: " + JSON.stringify(currentListIndex));
  return currentListIndex;
}

function extractDataReference(indexString) {
  var indexArray = indexString.split("-");
  var currentListIndex = currentList;

  for (var i=0; i < indexArray.length; i++) {
    if (currentListIndex["type"] == "folder") {
      currentListIndex = currentListIndex["list"][parseInt(indexArray[i])]; 
    }
    else {
      currentListIndex = currentListIndex[parseInt(indexArray[i])]; 
    }
  }

  //console.log("Extract returning: " + JSON.stringify(currentListIndex));
  return currentListIndex;
}

function reconcileFolder(nextList,purgeDeleted) {

  var currentLevelList = []

  for (var i=0; i < nextList.length; i++) {

    var currentId = nextList[i]["id"].toString();
    var currentChild = nextList[i]["children"];
    var currentNode = $("li[data-id='"+currentId+"']");

    var markedForDeletion = (nextList[i]["isDeleted"] == undefined)?false:nextList[i]["isDeleted"];

    if (purgeDeleted && markedForDeletion) { continue; }

    console.log("Evaluating: " + currentId.toString());
    console.log(" and CurrentList: " + JSON.stringify(currentList));

    if (currentNode.hasClass('dd-nonest')) { // Request
      //currentLevelList.push(dataListLevel[currentId]);
      console.log("Extracting request: " + JSON.stringify(extractData(currentId)));
      var currentListToHTML = extractData(currentId);
      currentListToHTML["toDelete"] = markedForDeletion;
      currentLevelList.push(currentListToHTML);
    } else { // Folder

      // Get previous state of currentList
      var tempFolder = extractData(currentId);
      tempFolder["toDelete"] = markedForDeletion;
      console.log("tempFolder: " + JSON.stringify(tempFolder));

      // Recurse thru child
      console.log("child: " + JSON.stringify(currentChild));
      if (currentChild == undefined || currentChild == []) {
        tempFolder["list"] = [];
      } else {

        tempFolder["list"] = reconcileFolder(currentChild,purgeDeleted);
      }
      console.log("tempFolder[\"list\"]: " + JSON.stringify(tempFolder["list"]));
      currentLevelList.push(tempFolder);
      //currentList[currentId]["list"] = reconcileFolder(nextList[i]["children"],dataListLevel[i]["list"]);
      //currentLevelList.push(dataListLevel[currentId]);
    }
  }
  console.log(" returning currentLevelist: " + JSON.stringify(currentLevelList));
  return currentLevelList;
}

function reconcileList(purgeDeleted) {
  var updatedList = [];
  var iteratingFolder = false;
  var currentFolder = null;
  if (newEntry) {
    updatedList = currentList;
    newEntry = false;
  } else if (true) {
    var serializedList = $('#nestable').nestable('serialize');
    console.clear();
    console.log(" === Serialized before: " + JSON.stringify(serializedList));
    console.log(" === Currentlist before: " + JSON.stringify(currentList));
    updatedList = reconcileFolder(serializedList,purgeDeleted);

    /*
    $('ol.dd-list').children().each(function() {
      alert($(this).prop('outerHTML'));
      console.log('The id list: ' + this.getAttribute('data-id') + this.innerHTML);
      if ($(this).hasClass('dd-nonest')) { // If request
        updatedList.push(currentList[this.getAttribute('data-id')]);
      } else { // If Folder
        currentFolder = new Array();
      }
    });
*/
  } else {

    updatedList = currentList;
  }
  currentList = updatedList;
  console.log(" === Currentlist after: " + JSON.stringify(currentList));



  if (currentList.length == 0 ) {
    if ($('#reorderFields').is(":visible")) $('#reorderFields').hide();  
  } else {
    if (!$('#reorderFields').is(":visible")) $('#reorderFields').show();
  }

}


function initData() {

  currentSettings = localStorage.settings;
  console.log( "localStorage.settings: " + currentSettings);

  if (currentSettings === null || currentSettings === undefined) {
    currentSettings = {};
    currentSettings["vibration"] = 100;
    localStorage.settings = JSON.stringify(currentSettings);

  } else {
    currentSettings = JSON.parse(currentSettings);
    switch (currentSettings["vibration"]) {
      case 100:
        document.getElementById("vibeDurationList").selectedIndex = 0;
        break;
      case 300:
        document.getElementById("vibeDurationList").selectedIndex = 1;
        break;
      case 500:
        document.getElementById("vibeDurationList").selectedIndex = 2;
        break;
      case 0:
        document.getElementById("vibeDurationList").selectedIndex = 3;
        break;
      default:
        document.getElementById("vibeDurationList").selectedIndex = 0;
    }
  }

  var visitedVersion = localStorage.getItem(JsAppVersion);

  var isPre310 = (document.referrer.indexOf("upgrade") == -1);
  var isFirstTimeSeeingCurrentUpdate = visitedVersion === null;


  if (isFirstTimeSeeingCurrentUpdate && false) {
    localStorage[JsAppVersion]  = "visited";
    $("#update-tooltip").click();
  }

  if (isPre310) {
    $('#hamburger-menu').remove();
  }



  if (!(localStorage.getItem("array")===null)) {
    console.log("Found existing list. Loading localStorage.");
    console.log(localStorage['array']);
    currentList = JSON.parse(localStorage['array']);

  } else {
    // This will be the default infomation with example data
    // Useful in helping newcomers learn what type of input is acceptable
    console.log("localStorage is null. Using default data.");
    currentList = [];
    /*[
      {
        "name" : "Example HTTP GET",
        "endpoint": "https://example.com:8080/endpoint", 
        "json": ""
      },
      {
        "name" : "Example JSON POST",
        "endpoint": "https://example.com:8080/jsonendpoint",
        "json": '{"key":"value","key":"value"}'
      },
      {
        "name" : "Example2 JSON POST",
        "endpoint": "https://example2.com:8080/jsonendpoint",
        "json": '{"key":"value","key":"value"}'
      }
    ];*/
  }

  if (currentList.length == 0 ) {
    if ($('#reorderFields').is(":visible")) $('#reorderFields').hide();  
  } else {
    if (!$('#reorderFields').is(":visible")) $('#reorderFields').show();
  }
}

function jsonSelected() {
  return $( "a[name=tab-1].tab-button.active" ).html() == "POST";
}
function jsonPutSelected() {
  return $( "a[name=tab-1].tab-button.active" ).html() == "PUT";
}

function testHttp() {
  var displayedName = $('#displayedName').val();
  var endpointURL = $('#httpGetUrlInput').val();
  var jsonString = $('#jsonPostJsonInput').val();



  if (displayedName == null || displayedName == "")
  {
      animateRed($('#displayedName').parent());

  } else if (endpointURL == null || endpointURL == "") {
      animateRed($('#httpGetUrlInput').parent());
  } else if ((jsonString == null || jsonString == "") && jsonSelected()) {
      animateRed($('#jsonPostJsonInput'));
  } else {
    $('#testButton').addClass('pendingResponse');
    $('#testButton').val('');
    //console.log("JSON String: " + jsonString);
    //console.log(JSON.parse(jsonString));
      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
    
    if (jsonSelected()) {

  /*
        $.ajax({
        dataType: "jsonp",
        url: "http://api.openweathermap.org/data/2.5/forecast/city",
        jsonCallback: 'jsonp',
    data: { id: "524901", APPID: "da0bd1a46046c9f4d18a3fca969929b1" },
        cache: false,
        success: function (data) {
          alert(JSON.stringify(data));
        }
      });
  */

      $.ajax({
        method: "POST",
        url: endpointURL,
        data: JSON.parse(jsonString),
        dataType: "json",
        success: function(data){
          $('#testResults').html(JSON.stringify(data));
          $('#testResultsContainer').show();
          $('#testButton').removeClass('pendingResponse');
          $('#testButton').val('Test');
          $('html, body').animate({
              scrollTop: $("#testResultsContainer").offset().top
          }, 1000);
        },
        failure: function(errMsg) {
          $('#testResults').html(JSON.stringify(errMsg));
          $('#testResultsContainer').show();
          $('#testButton').removeClass('pendingResponse');
          $('#testButton').val('Test');
          $('html, body').animate({
              scrollTop: $("#testResultsContainer").offset().top
          }, 1000);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          var respStatus = jqXHR.status;
          var respText = jqXHR.responseText;
          var respStatusText = jqXHR.statusText;
          var results = respStatus + " " + respStatus + ": " + respText;

          if (respStatus == 0) {
            results = results + " Encountered an error. Make sure Access-Control-Allow-Origin is configured.";
          }

          $('#testResults').html(results);
          $('#testResultsContainer').show();
          $('#testButton').removeClass('pendingResponse');
          $('#testButton').val('Test');
          $('html, body').animate({
              scrollTop: $("#testResultsContainer").offset().top
          }, 1000);
        }
      });
    }
    else if (jsonPutSelected()) {

      xhr.open('PUT', endpointURL);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        console.log("Received response from server");
          if (xhr.status === 200) {
            $('#testResults').html(JSON.stringify(xhr.responseText));
            $('#testResultsContainer').show();
            $('#testButton').removeClass('pendingResponse');
            $('#testButton').val('Test');
            $('html, body').animate({
                scrollTop: $("#testResultsContainer").offset().top
            }, 1000);
              //var userInfo = JSON.parse(xhr.responseText);
          } else {
            $('#testResults').html(JSON.stringify(xhr.statusText ));
            $('#testResultsContainer').show();
            $('#testButton').removeClass('pendingResponse');
            $('#testButton').val('Test');
            $('html, body').animate({
                scrollTop: $("#testResultsContainer").offset().top
            }, 1000);
          }
      };
      xhr.onreadystatechange = function (oEvent) {  
        console.log("Received response for PUT request");
        if (xhr.readyState === 4) {  
          if (xhr.status === 200) {  
            $('#testResults').html(JSON.stringify(xhr.responseText));
            $('#testResultsContainer').show();
            $('#testButton').removeClass('pendingResponse');
            $('#testButton').val('Test');
            $('html, body').animate({
                scrollTop: $("#testResultsContainer").offset().top
            }, 1000);
          } else if (xhr.status === 0) {
            $('#testResults').html("Encountered an error. Make sure Access-Control headers are configured. " + JSON.stringify(xhr.responseText ));
            $('#testResultsContainer').show();
            $('#testButton').removeClass('pendingResponse');
            $('#testButton').val('Test');
            $('html, body').animate({
                scrollTop: $("#testResultsContainer").offset().top
            }, 1000);
          } else {
            $('#testResults').html("Encountered an error " + JSON.stringify(xhr.responseText ));
            $('#testResultsContainer').show();
            $('#testButton').removeClass('pendingResponse');
            $('#testButton').val('Test');
            $('html, body').animate({
                scrollTop: $("#testResultsContainer").offset().top
            }, 1000);
          } 
        }  
      }; 

      xhr.send(jsonString);
      console.log("Sending Put request: " + jsonString);


      //xhr.send(JSON.stringify({"mode":"signal","state":"on","channel":"tv"}));

    } else {

      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            $('#testResults').html(JSON.stringify(xhr.responseText));
            $('#testResultsContainer').show();
            $('#testButton').removeClass('pendingResponse');
            $('#testButton').val('Test');
            $('html, body').animate({
                scrollTop: $("#testResultsContainer").offset().top
            }, 1000);
            console.log("Received response from GET:")
            console.log(JSON.stringify(xhr.responseText));
          }
      }
      xhr.open("GET", endpointURL, true);
      try {
        xhr.send(null);  
      } catch (err) {
        $('#testResults').html(JSON.stringify(err));
        $('#testResultsContainer').show();
        $('#testButton').removeClass('pendingResponse');
        $('#testButton').val('Test');
        $('html, body').animate({
            scrollTop: $("#testResultsContainer").offset().top
        }, 1000);
        console.log("Error sending XMLHttpRequest: " + JSON.stringify(err));
      }

/*

      $.ajax({
        method: "GET",
        url: endpointURL,
        success: function(data){
          $('#testResults').html(JSON.stringify(data));
          $('#testResultsContainer').show();
          $('#testButton').removeClass('pendingResponse');
          $('#testButton').val('Test');
          $('html, body').animate({
              scrollTop: $("#testResultsContainer").offset().top
          }, 1000);
          //alert(JSON.stringify(data));
        },
        failure: function(errMsg) {
          $('#testResults').html(JSON.stringify(errMsg));
          $('#testResultsContainer').show();
          $('#testButton').removeClass('pendingResponse');
          $('#testButton').val('Test');
          $('html, body').animate({
              scrollTop: $("#testResultsContainer").offset().top
          }, 1000);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 0) {
              document.getElementById('getFrame').src = endpointURL;

              $('#testResults').html("Encountered an error. The Access-Control-Allow-Origin header may not be configured.");
              $('#testResultsContainer').show();
              $('#testButton').removeClass('pendingResponse');
              $('#testButton').val('Test');
              $('html, body').animate({
                  scrollTop: $("#testResultsContainer").offset().top
              }, 1000);
          }
        }
      });*/
    }
  }
}

var isDragging = false;
$("label.item")
.mousedown(function() {
    isDragging = false;
})
.mousemove(function() {
    isDragging = true;
    //alert('asdf');
 })
.mouseup(function() {
    isDragging = false;
});

function verifyJson() {
    var validationLabel = document.getElementById('validationFeedbackLabel');
    console.log("Input : " + $('#jsonPostJsonInput').val());
    if (IsJsonString($('#jsonPostJsonInput').val())) {
      console.log("valid");
      animateGreen($('#jsonPostJsonInput'));
    } else {
      console.log("invalid");
      animateRed($('#jsonPostJsonInput'));
    }
  }

function resetAfterCreation() {
    document.getElementById('createNewFields').style.display = "none";
}

function showReorderDisplay() {
  reconcileList(false);
  generateLists();
  clearFields();
  document.getElementById('createNewFields').style.display = "none";
  document.getElementById('createNewFolderFields').style.display = "none";

  $('#pebbleSaveButton').show();
  $('#hamburger-menu').show();
  closeHamburger();
  $('footer').show();
}

function showCreateFolderDisplay() {
    reconcileList(false);
    generateLists();
    clearFields();

    $('#modifyExistingFolderButton').hide();
    $('#createNewFolderButton').show();
    $('#createNewFolderFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();
}

function showAboutDisplay() {

    clearFields();

    $('#modifyExistingFolderButton').hide();
    $('#aboutFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();

}

function showSettingsDisplay() {

    clearFields();

    $('#modifyExistingFolderButton').hide();
    $('#settingsFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();

}

function showDonateDisplay() {

    clearFields();

    $('#modifyExistingFolderButton').hide();
    $('#donateFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();

}

function showReportDisplay() {

    clearFields();

    $('#modifyExistingFolderButton').hide();
    $('#reportFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();

}

function showChangelogDisplay() {

    clearFields();

    $('#modifyExistingFolderButton').hide();
    $('#changelogFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();

}

function showBackupDisplay() {

    reconcileList(false);
    generateLists();
    clearFields();

    // load field with data
    $('#saveData').val(JSON.stringify(currentList));

    $('#modifyExistingFolderButton').hide();
    $('#backupFields').show();

    document.getElementById('reorderFields').style.display = "none";

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();
}

function showCreateDisplay(usingIndex) {
    // Show the div that contains user entry fields

    reconcileList(false);
    generateLists();

    var isRequest = false;

    if (usingIndex == null || usingIndex === undefined) {
      isRequest = true;
    } else {
      usingIndex = extractDataReference(usingIndex);
       if (usingIndex["type"] == "request") {
        isRequest = true;
       }
    }

    clearFields();
    generateTemplates();


    if (usingIndex != null) { // modifying

      currentIndex = usingIndex;
      currentType = usingIndex["type"];

      $('#createNewButton').hide();
      $('#createNewFolderButton').hide();
      $('#modifyExistingButton').show();
      $('#modifyExistingFolderButton').show();

      if (currentType == "folder"){

        $('#folderDisplayedName').val(usingIndex["name"]);

      } else if (currentType = "request") {

        $('#GET').removeClass("active");
        $('#PUT').removeClass("active");
        $('#POST').removeClass("active");

        $('#'+usingIndex["method"]).trigger("click");
        $('#'+usingIndex["method"]).addClass("active");

        $('#displayedName').val(usingIndex["name"]);
        $('#httpGetUrlInput').val(usingIndex["endpoint"]);
        $('#jsonPostJsonInput').val(usingIndex["json"]);
      }
    } else { // Creating new
      $('#modifyExistingButton').hide();
      $('#modifyExistingFolderButton').hide();
      $('#createNewButton').show();
      $('#createNewFolderButton').show();
    }

    $('#testResultsContainer').hide();
    $('#pebbleSaveButton').hide();
    $('#hamburger-menu').hide();
    $('footer').hide();

    document.getElementById('reorderFields').style.display = "none";

    if (isRequest) { // show request fields

      document.getElementById('createNewFields').style.display = "block";

    } else { // show folder fields 

      document.getElementById('createNewFolderFields').style.display = "block";

    }

}

function showRemoveDisplay() {

  reconcileList(false);
  generateLists();
  clearFields();  
}

function showModifyDisplay() {

  reconcileList(false);
  generateLists();
  clearFields();

  generateTemplates();

  document.getElementById('createNewFields').style.display = "none";

  $('#createNewFolderFields').hide();
  $('#backupFields').hide();
  $('#reportFields').hide();
  $('#aboutFields').hide();
  $('#settingsFields').hide();
  $('#donateFields').hide();
  $('#changelogFields').hide();

  $('#pebbleSaveButton').show();
  $('#hamburger-menu').show();
  closeHamburger();

  $('footer').show();
}

function clearFields() {
  $('#displayedName').val('');
  $('#httpGetUrlInput').val('');
  $('#jsonPostJsonInput').val('');
  $('#folderDisplayedName').val('');
}

function modifyExistingFolder() {

  var folderDisplayedName = $('#folderDisplayedName').val();

  if (folderDisplayedName == null || folderDisplayedName == "")
  {
      animateRed($('#folderDisplayedName').parent());


  } else {
    currentIndex["type"] = 'folder';
    currentIndex["name"] = folderDisplayedName;
    newEntry = true;
    showReorderDisplay();
  }
}

function modifyExistingEntry() {

  var displayedName = $('#displayedName').val();
  var endpointURL = $('#httpGetUrlInput').val();
  var jsonString = $('#jsonPostJsonInput').val();
  var methodType = $( "a[name=tab-1].tab-button.active" ).attr('id');

  if (displayedName == null || displayedName == "")
  {
      animateRed($('#displayedName').parent());
  } else if (endpointURL == null || endpointURL == "") {
      animateRed($('#httpGetUrlInput').parent());
  } else if ((jsonString == null || jsonString == "") && jsonSelected()) {
      animateRed($('#jsonPostJsonInput'));
  } else {
    if (jsonSelected() || jsonPutSelected()) {
      currentIndex["type"] = 'request';
      currentIndex["name"] = displayedName;
      currentIndex["endpoint"] = endpointURL;
      currentIndex["json"] = jsonString;
      currentIndex["method"] = methodType;
    } else {
      currentIndex["type"] = 'request';
      currentIndex["name"] = displayedName;
      currentIndex["endpoint"] = endpointURL;
      currentIndex["json"] = "";
      currentIndex["method"] = methodType;
    }
    newEntry = true;
    showModifyDisplay();
  }
}

function createNewFolder() {

  var folderDisplayedName = $('#folderDisplayedName').val();

  if (folderDisplayedName == null || folderDisplayedName == "")
  {
      animateRed($('#folderDisplayedName').parent());

  } else {
    currentList.push({
      "type": 'folder',
      "name": folderDisplayedName,
      "list": []
    });
    newEntry = true;
    showReorderDisplay();
  }
}

function createNewEntry() {

  var displayedName = $('#displayedName').val();
  var endpointURL = $('#httpGetUrlInput').val();
  var jsonString = $('#jsonPostJsonInput').val();
  var methodType = $( "a[name=tab-1].tab-button.active" ).attr('id');

  if (displayedName == null || displayedName == "")
  {
      animateRed($('#displayedName').parent());

  } else if (endpointURL == null || endpointURL == "") {
      animateRed($('#httpGetUrlInput').parent());
  } else if ((jsonString == null || jsonString == "") && jsonSelected()) {
      animateRed($('#jsonPostJsonInput'));
  } else {
    if (jsonSelected() || jsonPutSelected()) {
      currentList.push({
        "type": 'request',
        "name": displayedName,
        "endpoint": endpointURL,
        "json": jsonString,
        "method": methodType
      });
    } else {
        currentList.push({
        "type": 'request',
        "name": displayedName,
        "endpoint": endpointURL,
        "json": "",
        "method": methodType
      });
    }
    newEntry = true;
    showReorderDisplay();

  }
}

function saveVibration() {


  currentSettings.vibration = parseInt(document.getElementById("vibeDurationList").options[document.getElementById("vibeDurationList").selectedIndex].value);

  localStorage.settings = JSON.stringify(currentSettings);
  showModifyDisplay();
}

function loadBackupData() {

  var loadSuccessful = setConfigData($('#loadData').val());

  if (loadSuccessful) {
    currentList = JSON.parse($('#loadData').val());
    newEntry = true;
    showModifyDisplay();
    $('#loadData').val('');
  }
}

function setConfigData(stringData) {

  var success = false;

  try {
      stringData = JSON.parse(stringData);
      var options = {
        'array': stringData
      };
      localStorage['array'] = JSON.stringify(options['array']);
      success = true;
  } catch (e) {
      alert ('Format of the data to load is invalid');
  }

  return success;



}

  function getConfigData() {
 
    var options = {
      'array': currentList,
      'settings': currentSettings
    };

    // Save for next launch
    localStorage['array'] = JSON.stringify(options['array']);
    localStorage['settings'] = JSON.stringify(options['settings']);

    console.log('Got options: ' + JSON.stringify(options));
    return options;
  }

  function getQueryParam(variable, defaultValue) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return defaultValue || false;
  }

function sendClose(saveChanges) {
  console.log("Sending close");

  if (saveChanges) {
    reconcileList(true);

    // Set the return URL depending on the runtime environment
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to + encodeURIComponent(JSON.stringify(getConfigData()));
  } else {
    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to;
  }
}



function showHttpGetForm() {
    document.getElementById('JsonPostFields').style.display = "none";

}

function showJsonPostForm() {
    document.getElementById('JsonPostFields').style.display = "block";
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function toggleHamburger() {
  if ($('.hamburger.hamburger--vortex').hasClass("is-active")) { // CLOSE OPTIONS
    $('.hamburger.hamburger--vortex').removeClass("is-active")
    $( "#hamburger-content" ).animate({
      width: "0px"
    }, 500, function() {
    });
    $('#ham-back').animate({ width: "0%" }, 500);
    $('#backupButton').animate({ width: "0%" }, 500);
    $('#settingsButton').animate({ width: "0%" }, 500);
    $('#reportButton').animate({ width: "0%" }, 500);
    $('#donateButton').animate({ width: "0%" }, 500);
    $('#aboutButton').animate({ width: "0%" }, 500);
    $('#changelogButton').animate({ width: "0%" }, 500);
    $('.hamburger-img').animate({ width: "0px" }, 500);
    $('.hamburger-label').hide();
  } else {
    $('.hamburger.hamburger--vortex').addClass("is-active") // OPEN OPTIONS
    $( "#hamburger-content" ).animate({
      width: "100%"
    }, 500, function() {
    });
    $('#ham-back').animate({ width: "100%" }, 500);
    $('#backupButton').animate({ width: "15.5%" }, 500);
    $('#settingsButton').animate({ width: "15.5%" }, 500);
    $('#reportButton').animate({ width: "15.5%" }, 500);
    $('#donateButton').animate({ width: "15.5%" }, 500);
    $('#aboutButton').animate({ width: "15.5%" }, 500);
    $('#changelogButton').animate({ width: "15.5%" }, 500);
    $('.hamburger-img').animate({ width: "14px" }, 500); // global
    $('.hamburger-label').show();
  }
}

function closeHamburger() {
    if ($('.hamburger.hamburger--vortex').hasClass("is-active")) { // CLOSE OPTIONS
      $('.hamburger.hamburger--vortex').removeClass("is-active")
      $( "#hamburger-content" ).css("width","0px");
      $('#ham-back').css("width","0%");
      $('#backupButton').css("width","0%");
      $('#settingsButton').css("width","0%");
      $('#reportButton').css("width","0%");
      $('#donateButton').css("width","0%");
      $('#aboutButton').css("width","0%");
      $('#changelogButton').css("width","0%");
      $('.hamburger-img').css("width","0px");
      $('.hamburger-label').hide();
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


