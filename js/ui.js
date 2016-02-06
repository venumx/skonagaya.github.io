
var $createButton = $('#createButton');
var $createFormContainer = $('#createNewFields');
var $saveButton = $('#saveButton');
var $addButton = $('#addButton');
var $checkJsonButton = $('#jsonPostJsonInput');

var requestTimeout = 3000;
var currentList;
var currentIndex = null;
var newEntry = false;

(function() {
  document.getElementById('createNewFields').style.display = "none";
  document.getElementById('JsonPostFields').style.display = "none";
  //$('#validationFeedbackLabel').hide();


  $('#testResultsContainer').hide();
  $('#getFrame').hide();
  $('#createNewFolderFields').hide();



  $( "#templateList" )
    .change(function () {
      var selectedID = document.getElementById("templateList").options[document.getElementById("templateList").selectedIndex].id;

      $('#displayedName').val(currentList[selectedID]["name"]);
      $('#httpGetUrlInput').val(currentList[selectedID]["endpoint"]);
      $('#jsonPostJsonInput').val(currentList[selectedID]["json"]);


      $('#GET').removeClass("active");
      $('#PUT').removeClass("active");
      $('#POST').removeClass("active");
      $('#'+currentList[selectedID]["method"]).trigger("click");
      $('#'+currentList[selectedID]["method"]).addClass("active");

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
  expandBtnHTML   : '<button class="dd-action" data-action="expand" type="button"><i class="icon-chevron-right"></i></button>',
  collapseBtnHTML : '<button class="dd-action" data-action="collapse" type="button"><i class="icon-chevron-down"></i></button>',
  customActions   : {
    'remove'    : function(item,button) {
      if( item.hasClass('dd-deleted') ) {
        item.data('isDeleted',false).removeClass('dd-deleted');
        button.html('<i class="icon-remove"></i>');
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



function testingItOut() {
}

function generateTemplates(){
  $('#templateList').empty();
  var newTemplateEntry = document.createElement('option');
  newTemplateEntry.className = 'item-select-option';
  newTemplateEntry.id = "select";
  if (currentList.length == 0 || currentList == null) {
    newTemplateEntry.innerHTML = "No templates to choose from";
  } else { 
    newTemplateEntry.innerHTML = "Select a template";
  }
  $('#templateList').append(newTemplateEntry);
  for (var i=0; i < currentList.length; i++) {
    var newTemplateEntry = document.createElement('option');
    newTemplateEntry.id = i;
    newTemplateEntry.className = 'item-select-option';
    newTemplateEntry.innerHTML = currentList[i]['name'];
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

  var newRemoveButton = document.createElement('button');
  newRemoveButton.setAttribute("class", "dd-action pull-right");
  newRemoveButton.setAttribute("type", "button");
  newRemoveButton.setAttribute("data-action", "remove");
  newRemoveButton.setAttribute("title", "Remove");

  var newRemoveIcon = document.createElement('i');
  newRemoveIcon.setAttribute("class", "icon-remove");

  var newModifyButton = document.createElement('button');
  newModifyButton.setAttribute("class", "dd-action pull-right");
  newModifyButton.setAttribute("type", "button");
  newModifyButton.setAttribute("title", "Modify");

  newModifyButton.onclick = function modifyLabelOnClick () {
    var thisIndex = this.parentNode.getAttribute("data-id");
    showCreateDisplay(extractDataReference(thisIndex));
  }

  var newModifyIcon = document.createElement('i');
  newModifyIcon.setAttribute("class", "icon-cog");

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
  newRemoveIcon.setAttribute("class", "icon-remove");

  var newModifyButton = document.createElement('button');
  newModifyButton.setAttribute("class", "dd-action pull-right");
  newModifyButton.setAttribute("type", "button");
  newModifyButton.setAttribute("title", "Modify");

  newModifyButton.onclick = function modifyLabelOnClick () {
    var thisIndex = this.parentNode.getAttribute("data-id");
    showCreateDisplay(extractDataReference(thisIndex));
  }

  var newModifyIcon = document.createElement('i');
  newModifyIcon.setAttribute("class", "icon-cog");

  var newExpandButton = document.createElement('button');
  newExpandButton.setAttribute("class", "dd-action");
  newExpandButton.setAttribute("data-action", "expand");
  newExpandButton.setAttribute("type", "button");
  newExpandButton.setAttribute("id", "custom");

  var newExpandIcon = document.createElement('i');
  newExpandIcon.setAttribute("class", "icon-chevron-right");

  var newCollapseButton = document.createElement('button');
  newCollapseButton.setAttribute("class", "dd-action");
  newCollapseButton.setAttribute("data-action", "collapse");
  newCollapseButton.setAttribute("type", "button");
  newCollapseButton.setAttribute("id", "custom");

  var newCollapseIcon = document.createElement('i');
  newCollapseIcon.setAttribute("class", "icon-chevron-down");

  var newHandle = document.createElement('div');
  newHandle.setAttribute("class", "dd-handle");
  newHandle.innerHTML = folderName;

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

  var addItemDraggable = document.createElement('div');
  addItemDraggable.className = "item addNewButton";
  addItemDraggable.innerHTML = '<a href="#" onclick="showCreateDisplay(null);">Create Request</a>';

  var addFolderItemDraggable = document.createElement('div');
  addFolderItemDraggable.className = "item addNewButton";
  addFolderItemDraggable.innerHTML = '<a href="#" onclick="showCreateFolderDisplay();">Create Folder</a>';

  $('.item-draggable-list').parent().append(addItemDraggable);
  $('.item-draggable-list').parent().append(addFolderItemDraggable);

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

}


function initData() {
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
}

function jsonSelected() {
  return $( "a[name=tab-1].tab-button.active" ).html() == "POST JSON";
}
function jsonPutSelected() {
  return $( "a[name=tab-1].tab-button.active" ).html() == "PUT JSON";
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

      var xhr = new XMLHttpRequest();
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
      });
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
  document.getElementById('reorderFields').style.display = "block";

  $('#pebbleSaveButton').show();
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

}

function showCreateDisplay(usingIndex) {
    // Show the div that contains user entry fields

    reconcileList(false);
    generateLists();

    var isRequest = (usingIndex == null || usingIndex["type"] == "request");

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
  document.getElementById('reorderFields').style.display = "block";

  $('#createNewFolderFields').hide();
  $('#pebbleSaveButton').show();
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

  function getConfigData() {
 
    var options = {
      'array': currentList
    };

    // Save for next launch
    localStorage['array'] = JSON.stringify(options['array']);

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