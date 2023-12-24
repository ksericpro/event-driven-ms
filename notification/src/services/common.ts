export default class Common {
  static isJson(str:string) {
    // console.log(str)
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  static checkNull(str:string) {
    // console.log(str, str.length)
    return str.length !== 0
  }
}
