function auroraParseBoolean(b){
    if(b=="true"||b==true)
        return true;
    return false;
}
// Array Remove - By John Resig (MIT Licensed)

/*Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};      */


Array.indexOf = function(array, needle) {
        return arrayIndexOf(array, needle);
    };  

arrayIndexOf = function(arr, needle) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === needle) {
                return i;
            }
        }
        return -1;
    };            
function arrayCut(array, index) {
    array.splice(index,1); 
};
Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};
//}
/*Array.prototype.contains = function(ob){
    return this.indexOf('Sam') > -1;
}    */
function arrayContains(array, search){
    return arrayIndexOf(array, search) > -1; 
}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};

String.prototype.replaceAll = function(replace, with_this) {
  return this.replace(new RegExp(replace, 'g'),with_this);
};