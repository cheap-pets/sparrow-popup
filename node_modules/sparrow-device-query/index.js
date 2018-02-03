const userAgent = window.navigator.userAgent.toLowerCase()

function check (flag) {
  return userAgent.indexOf(flag) !== -1
}

const isWindows = check('windows')
const isWindowsPhone = isWindows && check('phone')

const isAndroid = !isWindows && check('android')
const isAndroidPhone = isAndroid && check('mobile')

const isIphone = !isWindows && check('iphone')
const isIpad = check('ipad')
const isIpod = check('ipod')
const isIos = isIphone || isIpad || isIpod

const isMobile = isWindowsPhone || isAndroidPhone || isIphone || isIpod

const platform = isWindows ? 'windows' : isAndroid ? 'android' : isIos ? 'ios' : 'other'

if (isMobile) {
  window.document.documentElement.classList.add('mobile')
}

function orientation () {
  return window.innerHeight / window.innerWidth < 1 ? 'landscape' : 'portrait'
}

const devq = {
  isMobile,
  isIphone,
  isIpad,
  isIpod,
  isAndroidPhone,
  isWindowsPhone,
  platform,
  orientation: orientation()
}

window.addEventListener("orientationchange", function(event) {
  devq.orientation = orientation()
}, false);

export default devq
