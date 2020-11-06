import {select} from "d3-selection"
import {zoomTransform} from "d3-zoom"
let CONSTANTS = {
  defaultMac:"MAC",
  defaultName:"Name",
  phantomBeaconId:1,
  phantomString:"PHANTOM",
  phantomStringDelimetr:"#"
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function NodeItem(id)
 {
   return {
      id:id,
      name:CONSTANTS.defaultName,
      mac:CONSTANTS.defaultMac,
      isDestinct:true,      // whether node can be destinct or not
      isPhantom: false,
      isRouteSpelling: true,
      x:0,
      y:0,
      events:"",
      broadcast:"",
   }
 }
 function FloorItem(nodes,links)
 {
    return {
      nodes: nodes,
      links: links 
    }
 }
 function Plan(url,offset)
 {
    return {
      url: url,
      offset: offset || {x:0,y:0} 
    }
 }
 
function getCanvasOffset(id)
{
  return zoomTransform(select(id).node())
}

 function LinkItem(source,target,weight,events)
 {
   return {source:source,target:target,weight:weight,events:Array.isArray(events)?events:""}
 }
 
 export {makeid,NodeItem,LinkItem,getCanvasOffset,FloorItem,Plan,CONSTANTS}