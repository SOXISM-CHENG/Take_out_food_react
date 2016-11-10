/*
 * @Author: mocheng
 */

'use strict';

export default function linkFunctions(...funcs) {
    funcs = funcs.filter(f => typeof f === 'function');
    return function(...args) {
        funcs.forEach(f => f.apply(this, args));
    }
}
