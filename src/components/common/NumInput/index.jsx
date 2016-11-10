/*
 * @Author: mocheng
 */
import './index.less';
import React from "react";

export default class NumInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            addDisabled: false,
            minusDisabled: false
        }
    }
    handleChange=(event)=>{
        var value = parseInt(event.target.value) || 0;
        this.setValue(Math.abs(value));
    }
    setValue(value) {
        var newState = this.state;
        if (value <= (this.props.min || 0)) {
            value = this.props.min || 0;
            newState.minusDisabled = true;
        } else {
            newState.minusDisabled = false;
        }

        if ((this.props.max===0 || this.props.max) && value >= this.props.max) {
            value = this.props.max;
            newState.addDisabled = true;
        } else {
            newState.addDisabled = false;
        }

        if(this.props.onChange && this.props.onChange(value)===false){

        }else{
            newState.value = value ;
            this.setState(newState);
        }
    }
    componentWillMount() {
        this.setValue(this.props.value || 1);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.max != nextProps.max || this.props.min != nextProps.min) {
            var value = this.state.value;
            var newState = this.state;
            if (value <= (nextProps.min || 0)) {
                newState.minusDisabled = true;
            } else {
                newState.minusDisabled = false;
            }
            if (nextProps.max && value >= nextProps.max) {
                newState.addDisabled = true;
            } else {
                newState.addDisabled = false;
            }
            this.setState(newState);
        }
    }
    render(){
        let value;
        if(this.props.value != undefined){
            value = this.props.value;
        }else{
            value = this.state.value;
        }
        var addBtn = (
            <button
                type='button'
                className='btn_add'
                onClick={this.setValue.bind(this,value+1)}
                disabled={this.state.addDisabled}>
                <i className="fa fa-plus"></i>
            </button>
        );
        var minusBtn = (
            <button
                type='button'
                className='btn_minus'
                onClick={this.setValue.bind(this,value-1)} disabled={this.state.minusDisabled}>
                <i className="fa fa-minus"></i>
            </button>
        );
        return (
            <div
                style={{
                    width: this.props.width
                }}
                className={"input_num "+(this.props.className||'') }>
                {minusBtn}
                <input
                    type="text"
                    placeholder = {this.props.placeholder}
                    onChange={this.handleChange}
                    name={this.props.name}

                    value={value + (this.props.unit || 0)}/>
                {addBtn}
            </div>
        );
    }
}

