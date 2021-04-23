import JSONUtils from "./JsonUtils.js";
var componentsCant=0;
//hay que hacer que del local storage lea cuantos crear
function CreateSelectorComponent(jsonWComponents,params){
    // let cant=document.getElementById("cantId").nodeValue;
    let selectorBase=document.createElement("select");
    let components=jsonWComponents.components;
    let defaultOption=document.createElement("option");
    defaultOption.setAttribute("value","SeleccionarComponente");
    var text = document.createTextNode("Seleccionar Componente");
    defaultOption.appendChild(text);
    selectorBase.appendChild(defaultOption);    
    for (let index = 0; index < components.length; index++) {
        let option=document.createElement("option");
        option.setAttribute("value",components[index]);
        var text = document.createTextNode(components[index]);
        option.appendChild(text);
        selectorBase.appendChild(option);        
    }
    return selectorBase;
}

var jsonUtils=new JSONUtils("Assets/JSON/Components.json",GenerateList);
document.getElementById("componentButton").onclick=function(){
    jsonUtils.ReadTextFile();    
}
document.getElementById("generateButton").onclick=function(){
    GenerateFile();
}
function FillComponent(selector,cell){
    let value=selector.value;
    console.log(selector);
    console.log(value);
for (let index = 0; index < cell.childElementCount; index++) {
   cell.removeChild(cell.lastChild);
    
}
TableFillComponent(selector.value,cell,selector);
}

function GenerateList(jsonWComponents,params){
    let selectorBase=CreateSelectorComponent(jsonWComponents,params);
    let table=document.getElementById("Try");
    if(table.lastChild)table.removeChild(table.lastChild)
    let tblBody = document.createElement("tbody");
    let selectorOption=[...selectorBase];
    let cant=document.getElementById("componentCant").value;
    componentsCant=cant;
    for (let index = 0; index < cant; index++) {
        let selector=document.createElement("select");
        for (let index2 = 0; index2 < selectorOption.length; index2++) {
            let option=document.createElement("option");
            option.setAttribute("value",selectorOption[index2].innerHTML);
            var text = document.createTextNode(selectorOption[index2].innerHTML);
            option.appendChild(text);
            selector.appendChild(option);     
        }
        if(selectorOption.length>0){
            console.log(index);
            selector.setAttribute("id","SelectorComponent"+index);
            selector.variablesCant=0;
            let row=document.createElement("tr");
            let row2=document.createElement("tr");
            let cell=document.createElement("td");
            let cell1=document.createElement("td");
            let cell2=document.createElement("td");
            let p = document.createElement("label");
            console.log(selector);
            p.textContent="Porfavor seleccione la componente que desea añadir ";
            cell.appendChild(p);
            cell1.appendChild(selector);
            row.appendChild(cell);
            row.appendChild(cell1);
            row2.appendChild(document.createElement("td"));
            row2.appendChild(cell2);
            tblBody.appendChild(row);
            tblBody.appendChild(row2);
            selector.onchange=function(){FillComponent(selector,cell2);
            console.log(selector);
            }
        }}
        table.appendChild(tblBody);
    }
    
function TableFillComponent(value,cell,whereCantIs){
        let params;
        let cb=function(json,params){
            let table=document.createElement("table");
            let tblBody = document.createElement("tbody");
            let keys=Object.keys(json);
            let values=Object.values(json);
            for(let index=0;index<values.length;index++){
            let row=document.createElement("tr");
            let name=document.createElement("label");
            name.innerHTML=keys[index];
            name.id=whereCantIs.id+"variable"+whereCantIs.variablesCant;
            let cell=document.createElement("td");
            cell.appendChild(name);
            row.appendChild(cell);
            if(values[index].type!=undefined&&values[index].type!=null){
                let cell1=document.createElement("td");
                let input=document.createElement("input");
                let type;
                switch(values[index].type){
                    case "number":
                    type="number";
                    break;
                    case "text":
                    case "string":
                        type="text";
                        break;
                    case "bool":
                            type="checkbox";
                            break;
                }
                input.setAttribute("type",type);
               input.defaultValue=values[index].default;
               input.id=whereCantIs.id+"input"+whereCantIs.variablesCant;
                let cell2=document.createElement("td");
                let description=document.createElement("label");
                description.innerHTML=values[index].description;
                cell1.appendChild(input);
                cell2.appendChild(description);
                row.appendChild(cell1);
                row.appendChild(cell2);
            }
            else{   
                name.variablesCant=0;
                let cell1=document.createElement("td");
                TableFillComponent(keys[index],cell1,name);
                row.appendChild(cell1);
                
            }
            tblBody.appendChild(row);
            whereCantIs.variablesCant+=1;
            }
            table.appendChild(tblBody);
            params=document.createElement("button");
            params.innerHTML="prueba";
            cell.appendChild(table);
        }
        let jsonUtils2=new JSONUtils("Assets/JSON/"+value+".json",cb);
        jsonUtils2.ReadTextFile(params);
        
    }

function GenerateFile(){
    let luaCont="";
    let components=[];
    for (let index = 0; index < componentsCant; index++) {
        let selector=document.getElementById("SelectorComponent"+index);
        if(selector!=null&&selector!=undefined){
        luaCont+=selector.value+"={\n";
        components.push("\""+selector.value+"\"");
        luaCont+=FillLua(selector);
        luaCont+="\n";
    }
    }
    luaCont+="\n"
    let componentsText= "components ={ ";
    for (let index = 0; index < components.length; index++) {
        componentsText+=components[index];
        if(index<components.length-1) componentsText+=", ";
    }
    componentsText+="}\n";
    luaCont=componentsText+luaCont;
    console.log(luaCont);
    download(document.getElementById("fileName").value+".lua",luaCont);
}

function FillLua(whereCantIs){
    let luaCont="";
for (let index = 0; index < whereCantIs.variablesCant; index++) {
    let option=document.getElementById(whereCantIs.id+"variable"+index);
    if(option!=undefined&&option!=null){
    console.log(option.id);
    if(option.variablesCant!=undefined&&option.variablesCant!=null){
    luaCont+=option.innerHTML+"= {\n"; 
       luaCont+= FillLua(option)+"\n";}
    else{
        let input=document.getElementById(whereCantIs.id+"input"+index);
        if(input!=undefined&&input!=null){
            let value;
            if(input.type=="checkbox")
            value=input.checked;
            else
            value=input.value;
            luaCont+=input.type=="text"?  option.innerHTML +" = \""+ value+"\"":option.innerHTML +" = "+ value;
        }
    }
    if(index<whereCantIs.variablesCant-1) luaCont+=",";
    luaCont+="\n";
}
}
luaCont+="}";
return luaCont;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }