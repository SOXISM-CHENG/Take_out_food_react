/*
 * @Author: mocheng
 */

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'


const context = require.context('./', false, /\.(js|jsx)$/);
const keys = context.keys().filter(item => {
    return item !== './index.js' && item !== './index.jsx'
});

const reducers = keys.reduce((memo, key) => {
    const content = context(key);
    if(content.stateName){
        if(!memo[content.stateName]){
            let _func = content.default;
            memo[content.stateName] = content.default;
        }else{
            console.error(`reduce: stateName【${content.stateName}】重复`)
        }
    }else{
        let fileName = key.substring(2,key.length);
        console.error(`reduce: stateName不能为空,文件${fileName}`);
    }
    return memo;
}, {});

export default combineReducers({
    routing: routerReducer,
    ...reducers
});
