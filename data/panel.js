

var textArea = document.getElementById("edit-box");
var idxEdit = document.getElementById("idx-edit");
var label = document.getElementById("label");
var buttons = document.getElementById('buttons');
var buttonsArea = document.getElementById('buttons-area');
var delButton = document.getElementById('del-button');



self.port.on("updateButtons", function(funcs, labels){
  buttonsArea.innerHTML = "";
  for(var i=0; i<labels.length; i++){
    var x = document.createElement('input');
    x.type = 'button';
    x.value = labels[i];
    x.setAttribute("idx", i); //attention: 'i' reference in embeded function below
    x.addEventListener("click", function(event){self.port.emit("panel-button-click", this.getAttribute("idx"))});
    buttonsArea.appendChild(x);

    var y = document.createElement('a');
    y.innerHTML = 'Edit';
    y.href = 'javascript:';
    y.className = 'editButtons';
    y.setAttribute("idx", i);
    y.setAttribute("func", funcs[i]);
    y.setAttribute("label", labels[i]);
    y.addEventListener("click", function(event){
      textArea.value=this.getAttribute("func");
      label.value=this.getAttribute("label");
      idxEdit.value=this.getAttribute("idx");
      buttons.style.display='none';
      document.getElementById('addarea').style.display='';
      label.focus();
    });
    buttonsArea.appendChild(y);

    buttonsArea.appendChild(document.createElement('br'));
  }
});


document.getElementById('show-add').addEventListener('click', function(event){
  buttons.style.display='none';
  document.getElementById('addarea').style.display='';
  textArea.value="";
  label.value="";
  idxEdit.value="";
  label.focus();
}, false);

function showHideEdits(show){
  var a = "editButtonsShow";
  var b = "editButtons";
  if(show){
    a = "editButtons";
    b = "editButtonsShow";
  }
  var els = document.getElementsByClassName(a);
  var count=0;
  while(els.length>0 || count++<100){
    console.log(">>>" + els.length);
    els[els.length-1].className=b;
  }
}
document.getElementById('show-edit').addEventListener('click', function(event){
  showHideEdits(true);
  delButton.style.display='';
}, false);

document.getElementById('cancel-button').addEventListener('click', function(event){
  buttons.style.display='';
  delButton.style.display='none';
  delButton.value="Del";
  document.getElementById('addarea').style.display='none';
  showHideEdits(false);
}, false);


document.getElementById('save-button').addEventListener('click', function(event){
  self.port.emit("save-clicked", textArea.value, label.value, idxEdit.value);
  document.getElementById('cancel-button').dispatchEvent(new MouseEvent('click'));
}, false);


delButton.addEventListener('click', function(event){
  if(delButton.value=="Del"){
    delButton.value = "Confirm?";
    return;
  }
  if(delButton.value=="Confirm?"){
    self.port.emit("del-clicked", idxEdit.value);
    document.getElementById('cancel-button').dispatchEvent(new MouseEvent('click'));
  }
});
