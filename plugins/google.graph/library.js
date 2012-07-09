function mysqlDateToJS(dateStr){
    var t = dateStr.split(/[- :]/);
    return new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
}



 

google.load('visualization', '1', {packages:['gauge', 'corechart', 'annotatedtimeline', 'Table']}); 
var recE = receiverE();
var googleReadyB = recE.startsWith(false);   
         google.setOnLoadCallback(function(){
            recE.sendEvent(true);
         });
                                        
                                        
                                        

                                        
function AuroraTableToGoogleTable(table){
    var googleTable = new google.visualization.DataTable();
    for(col_key in table["COLUMNS"]){
        var col = table["COLUMNS"][col_key];
        var type = col.type;
        type = (type=="int")?"number":type;
        googleTable.addColumn(type, col.display);
    }           
    googleTable.addRows(table["DATA"].length);   
    for(i=0;i<table["DATA"].length;i++){
        var row = table["DATA"][i];
        for(c=0;c<row.length;c++)
            googleTable.setCell(i, c, table["DATA"][i][c]);
    }
    return googleTable;
}
function AuroraTableToCSVTable(table){
    var sb = new StringBuilderEx();
    for(col_key in table["COLUMNS"]){  
        sb.append(table["COLUMNS"][col_key].display+",");
    }           
    sb.append("\n");
    for(i=0;i<table["DATA"].length;i++){
        var row = table["DATA"][i];
        for(c=0;c<row.length;c++)
            sb.append(table["DATA"][i][c]+",");
        sb.append("\n");
    }
    //log(sb.toString());
    return sb.toString();
}