/*
 * @Author: mocheng
 */

'use strict';
import React from 'react';
import './Img/index.less';

const IMG_SERVER = 'http://testo2oimage.leimingtech.com/';

const reqWithContext = require.context('../images', true, /\.(png|jpg|gif)$/);

export function getRealPath(src){
    if(src){
        if(src.startWith('http')){
            return src;
        }else if(src.startWith('/')){
            return IMG_SERVER + src;
        }else{
            if(src.startWith('./')){
                return reqWithContext(src);
            }else{
                return reqWithContext('./'+src);
            }
        }
    }
}

export default class Img extends React.Component {
    static propTypes = {
        src: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
    }
    hadleClick=(e)=>{
        if(this.props.isShow){
            returnImg(getRealPath(this.props.src));
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        }

    }
    render() {
        let props = {...this.props};
        delete props.isShow;
        return (
            <img {...props} src={getRealPath(this.props.src)} onClick={this.hadleClick} />
        );
    }
}
/*
const dom = document.createElement("div");
appendChild(dom);

ReactDOM.render(<M/>,dom)*/
/*
<i class="anticon anticon-close-circle "></i>
*/
function returnImg(url){
    var imgdiv = document.createElement("div");
    imgdiv.setAttribute("class","showImg");
    imgdiv.setAttribute("id","showImg");

    var div = document.createElement("div");
    div.setAttribute("class","back");
    var ele=document.createElement("img");
    ele.setAttribute("src",url);
    var close=document.createElement("div");
    close.setAttribute("class","close");
    close.setAttribute("title","关闭");

    var icon=document.createElement("i");
    icon.setAttribute("class","fa  fa-close (alias)");
    close.appendChild(icon);
    imgdiv.appendChild(div);
    imgdiv.appendChild(ele);
    imgdiv.appendChild(close);

    imgdiv.addEventListener("click",removeImg);
    document.getElementsByTagName('body')[0].appendChild(imgdiv);
}
function removeImg(){
    document.getElementsByTagName('body')[0].removeChild(document.getElementById("showImg"));
}
