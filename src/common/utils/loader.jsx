/*
 * @Author: mocheng
 */

'use strict';
let loadedJSArray = [];
export default function loadJS(src, callback,attrs={}, multiple) {
    if (loadedJSArray.indexOf(src) === -1 || multiple) {
        var script = document.createElement('script');
        var head = document.getElementsByTagName('head')[0];
        var loaded;
        script.src = src;
        for(var prop in attrs){
            script.setAttribute(prop,attrs[prop]);
        }
        if (typeof callback === 'function') {
            script.onload = script.onreadystatechange = function() {
                if (!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))) {
                    script.onload = script.onreadystatechange = null;
                    loaded = true;
                    callback();
                }
            }
        }
        head.appendChild(script);
        loadedJSArray.push(src);
    } else {
        callback();
    }
}
