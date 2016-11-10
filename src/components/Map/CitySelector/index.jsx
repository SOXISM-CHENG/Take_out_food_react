/*
 * @Author: MoCheng
 */

'use strict';
import './index.less';
import React from 'react';
import cityData from './city';
import {
    AutoComplete
} from 'antd';

const Option = AutoComplete.Option;
const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default class CitySelector extends React.Component {
    static propTypes = {
        onChange: React.PropTypes.func.isRequired,
    };
    searchArray = [];
    constructor(props) {
        super(props);
    }
    handleChange = (value) => {
        this.props.onChange(value);
    }
    renderItems(data = []) {
        return data.map((item) => <li key={item.city_id} >{item.real}</li>);
    }
    renderFields() {
        let searchArray = [];
        let fields = cityData.map((items, i) => {
            if (items.length) {
                return (
                    <div key={i} className="city-field">
                        <span className="letter">{letter[i]}</span>
                        <ul>
                            {items.map((item)=>{
                                searchArray.push(item.real);
                                return <li key={item.city_id}
                                    onClick={this.handleChange.bind(this,item.real)}>{item.real}</li>
                            })}
                        </ul>
                    </div>
                )
            }
        });
        return {
            searchArray,
            fields
        }
    }
    render() {
        let { fields,searchArray } = this.renderFields();
        return (
            <div className='city-selector-wrap'>
                <div className="tool-bar">

                    <div className="guess-city">
                        <span>猜你在：</span>
                        <a onClick={this.handleChange.bind(this,this.props.guessCity)}>
                            {this.props.guessCity}
                        </a>
                    </div>
                    <div className="city-search-wrap">
                        <span>直接搜索</span>
                        <AutoComplete
                            style={{ width: 200 }}
                            dataSource={searchArray}
                            onSelect={this.handleChange}
                        />
                    </div>
                </div>
                {fields}
            </div>
        );
    }
}
