

var textArea = document.getElementById("edit-box");
var label = document.getElementById("label");
var buttons = document.getElementById('buttons');
var buttonsArea = document.getElementById('buttons-area');



self.port.on("updateButtons", function(labels){
  buttonsArea.innerHTML = "";
  for(var i=0; i<labels.length; i++){
    var x = document.createElement('input');
    x.type = 'button';
    x.value = labels[i];
    x.setAttribute("idx", i); //attention: 'i' reference in embeded function below
    x.addEventListener("click", function(event){self.port.emit("panel-button-click", this.getAttribute("idx"))});
    buttonsArea.appendChild(x);
    buttonsArea.appendChild(document.createElement('br'));
  }
});


document.getElementById('show-add').addEventListener('click', function(event){
  buttons.style.display='none';
  document.getElementById('addarea').style.display='';
  textArea.value="";
  label.value="";
  label.focus();
}, false);

document.getElementById('cancel-button').addEventListener('click', function(event){
  buttons.style.display='';
  document.getElementById('addarea').style.display='none';
}, false);

document.getElementById('add-button').addEventListener('click', function(event){
  self.port.emit("add-clicked", textArea.value, label.value);
  document.getElementById('cancel-button').dispatchEvent(new MouseEvent('click'));
}, false);
