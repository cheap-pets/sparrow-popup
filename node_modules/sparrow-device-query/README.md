# sparrow-device-query
get device properties in browser



### install

``` javascript
npm i sparrow-device-query
```



### usage

```javascript
const devq = require('sparrow-device-query')

//  devq.isMobile
//  devq.isIphone
//  devq.isIpad
//  devq.isIpod
//  devq.isAndroidPhone
//  devq.isWindowsPhone
//  devq.platform -> 'windows' | 'android' | 'ios' | 'other'
//  devq.orientation -> 'landscape' | 'portrait'
```

+ if isMobile got  "true", it will also put a "mobile" class name in document root (<HTML>)

