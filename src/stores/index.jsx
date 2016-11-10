/*
 * @Author: mocheng
 */

import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
}
from 'redux'
import middleware from './middleware';
import reducers from '../reducers/'

//redux 存放路由

var finalCreateStore = compose(
    applyMiddleware.apply(this, middleware),
    (process.env.NODE_ENV !== 'production' && window.devToolsExtension )
    ? window.devToolsExtension() : f => f
)(createStore);


export default finalCreateStore(reducers);
