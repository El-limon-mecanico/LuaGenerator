var JSONUtils=function(file,callback){
    this.ReadTextFile=function(params){
        ReadTextFile(params);
    }
    //All the code to execute after u get the JSON

    //Copied from https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript/45035939
    function ReadTextFile(params) {

            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(JSON.parse(rawFile.responseText),params);                     
                }
                else if(rawFile.readyState === 4&&rawFile.status=='404'){
                let error=document.createElement("label");    
                error.textContent="El archivo "+file+" NO se ha encontrado";
                document.getElementById("body").appendChild(error);
                document.getElementById("body").appendChild(document.createElement("br"));
                }
            }
            rawFile.send(null);
        
    }

}
export default JSONUtils;