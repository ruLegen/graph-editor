import {select} from "d3-selection"
import {zoomTransform} from "d3-zoom"
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
      mac:"AA:BB:CC:DD:EE:FF",
      x:10,
      y:30,
      events:[]
   }
 }
 function FloorItem(nodes,links)
 {
    return {
      nodes: nodes,
      links: links 
    }
 }
function getCanvasOffset(id)
{
  return zoomTransform(select(id).node())
}
 function LinkItem(source,target,weight,events)
 {
   return {source:source,target:target,weight:weight,events:Array.isArray(events)?events:[]}
 }
 
 export {makeid,NodeItem,LinkItem,getCanvasOffset,FloorItem}