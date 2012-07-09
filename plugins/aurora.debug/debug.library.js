function showObj(obj){
    alert(ObjectToString(obj));
}
function ObjectToString(object){
    var output = '';
for (property in object) {
  output += property + ': ' + object[property]+'; ';
}                                                   
return output;
}
function countProperties(object){
    var count = 0;
for (property in object) {
  count++;
}
return count;
}
function printHashTable(table){
 var loadWidgets = table.values();
    for(i=0;i<table.size();i++){
        alert(ObjectToString(loadWidgets[i]));
    }
}

window['log'] = function(message){
    if (window.console)
        console.log(message);
}