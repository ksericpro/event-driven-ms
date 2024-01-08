export default class Common {
    static isJson(str:string){
        //console.log(str)
        try {
            JSON.parse(str);
        return true
        } catch (e) {
            return false;
        }
      }
      
    static checkNull(str?:string){
        //console.log(str, str.length)
        if (str === undefined) {
            return false;
        }
        return str.length===0?false:true;
    }
}