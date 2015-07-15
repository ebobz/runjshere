var ss = require("sdk/simple-storage");
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var data = require("sdk/self").data;


//init stored function
var stored_funcs = ss.storage.functions;
var stored_labels = ss.storage.labels;
if ("undefined" == typeof(stored_funcs)){
  stored_funcs = [];
  stored_labels = [];
}

// Construct a panel, loading its content from the "panel.html"
// file in the "data" directory, and loading the "panel.js" script
// into it.
var panel = panels.Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: data.url("panel.js"),
  onHide: handleHide
});


// Create a button
var button = ToggleButton({
  id: "show-panel",
  label: "Show Panel",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});


//private functions
function handleHide() {
  button.state('window', {checked: false});
}

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
    updateButtons();
  }
}

function updateButtons(){
  //global vars
  stored_funcs = ss.storage.functions;
  stored_labels = ss.storage.labels;
  if ("undefined" == typeof(stored_funcs)){
    stored_funcs = [];
    stored_labels = [];
  }
  panel.port.emit("updateButtons", stored_funcs, stored_labels);
}



//functions visible to the panel

panel.port.on("panel-button-click", function(idx){
  var func_string = ""+stored_funcs[idx];
  console.log(func_string);
  require("sdk/tabs").activeTab.attach({
    contentScript: func_string
  });
});

panel.port.on("save-clicked", function (func, label, idx) {
  if ("undefined" == typeof(ss.storage.functions)){
    ss.storage.functions = [];
    ss.storage.labels = [];
  }
  var i = ss.storage.functions.length;
  if(idx != ""){
    i = idx;
  }
  ss.storage.functions[i] = func;
  ss.storage.labels[i] = label;
  updateButtons();
});

panel.port.on("del-clicked", function (idx) {
  if(idx == ""){
    return;
  }
  var newFunctions = [];
  var newLabels = [];
  for(var i=0; i<ss.storage.functions.length; i++){
    if(i != idx){
      newFunctions[newFunctions.length] = ss.storage.functions[i];
      newLabels[newLabels.length] = ss.storage.labels[i];
    }
  }
  ss.storage.functions = newFunctions;
  ss.storage.labels = newLabels;
  updateButtons();
});
