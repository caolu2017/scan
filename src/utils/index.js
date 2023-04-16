export function getCookie (name) {
  return localStorage.getItem(name)
}

function getsec(str) {
 
  if (!str) return 24 * 60 * 60 * 1000;
 
  const str1 = str.substring(1, str.length) * 1;
 
  const str2 = str.substring(0, 1);
 
  if (str2 === 's') {
 
    return str1 * 1000;
 
  }
 
  if (str2 === 'h') {
 
    return str1 * 60 * 60 * 1000;
 
  }
 
  if (str2 === 'd') {
 
    return str1 * 24 * 60 * 60 * 1000;
 
  }
 
  // 默认1天
 
  return 24 * 60 * 60 * 1000;
}
export function setCookie (name, value) {
  // const strsec = getsec(time);
 
  // const exp = new Date();
 
  // exp.setTime(exp.getTime() + strsec * 1);
 
  localStorage.setItem(name,value)
}
export function removeCookie (name, value) {
  if(name){
    console.log('hahaha', name)
    localStorage.removeItem(name)
  }else {
    localStorage.clear()
  }
}
export function getSession (cname) {
  // return localStorage.getItem(cname)
  return sessionStorage.getItem(cname) 

}
export function setSession (cname, cvalue) {
  sessionStorage.setItem(cname, cvalue)
  // localStorage.setItem(cname, cvalue);
}
