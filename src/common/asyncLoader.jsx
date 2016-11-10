/*
 * @Author: mocheng
 */

import React from 'react';

/**
 * 异步的组件
 */
export default function asyncLoader(component,loading) {

    return React.createClass({
        getInitialState() {
            return {
                Component: null
            }
        },
        componentDidMount() {
            component((Component) => {
                this.setState({
                    Component: Component.default || Component
                });
            });
        },


        render() {
            var Component = this.state.Component;
            if (Component) {
                return <Component {...this.props}/>
            } else {
                return <div/>;
            }
        }
    });
}
