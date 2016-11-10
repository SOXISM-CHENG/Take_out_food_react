/*
 * @Author: mocheng
 */

'use strict';
export default function(that,arr){
    if(arr instanceof Array){
        arr.forEach(method => {
            that[method] = (typeof that[method] === 'function' ? that[method].bind(that) : undefined);
        })
    }
}
