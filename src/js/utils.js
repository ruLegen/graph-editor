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

 function LinkItem(source,target,weight)
 {
   return {source:source,target:target,weight:weight}
 }
 
 export {makeid,NodeItem,LinkItem}