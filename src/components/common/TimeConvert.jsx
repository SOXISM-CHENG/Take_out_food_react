/*
 * @Author: mocheng
 */
var TimeConvert = {
	//时间戳转换为时分秒 HH:mm:SS,根据传过来的format决定返回格式,ymdhms,ymd,hms
	minsCon: function(times, format) {
		if(!times){
			return ;
		}
		var d = new Date(times);
		var HH = d.getHours();
		if (HH < 10) {
			HH = "0" + HH;
		}
		var mm = d.getMinutes();
		if (mm < 10) {
			mm = "0" + mm;
		}
		var ss = d.getSeconds();
		if (ss < 10) {
			ss = "0" + ss;
		}
		var mon = d.getMonth() + 1;
		if (mon < 10) {
			mon = "0" + mon;
		}
		var day = d.getDate();
		if (day < 10) {
			day = "0" + day;
		}
		if (format == "ymdhms") {
			return d.getFullYear() + '-' + mon + '-' + day + ' ' + HH + ':' + mm + ':' + ss;
		} else if (format == "hms") {
			return HH + ':' + mm + ':' + ss;
		} else if (format == "hm") {
			return HH + ':' + mm;
		} else if (format == "ymd") {
			return d.getFullYear() + '-' + mon + '-' + day;
		} else if (format == "md") {
			return mon + '月' + day + '日';
		}


	},
	strToDate: function(formatStr, dateStr = "") { //格式化日期字符串转换为日期
		var year = 0;
		var start = -1;
		var len = dateStr ? dateStr.length : 0;
		if ((start = formatStr.indexOf('yyyy')) > -1 && start < len) {
			year = dateStr.substr(start, 4);
		}
		var month = 0;
		if ((start = formatStr.indexOf('MM')) > -1 && start < len) {
			month = parseInt(dateStr.substr(start, 2)) - 1;
		}
		var day = 0;
		if ((start = formatStr.indexOf('dd')) > -1 && start < len) {
			day = parseInt(dateStr.substr(start, 2));
		}
		var hour = 0;
		if (((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len) {
			hour = parseInt(dateStr.substr(start, 2));
		}
		var minute = 0;
		if ((start = formatStr.indexOf('mm')) > -1 && start < len) {
			minute = dateStr.substr(start, 2);
		}
		var second = 0;
		if ((start = formatStr.indexOf('ss')) > -1 && start < len) {
			second = dateStr.substr(start, 2);
		}
		return new Date(year, month, day, hour, minute, second);
	},
	strToForStr: function(formatStr, dateStr) { //yyyy-MM-dd hh:mm:ss格式字符串转换为指定格式字符串
		let date = this.strToDate("yyyy-MM-dd HH:mm:ss", dateStr);
		let str = this.minsCon(date.getTime(), formatStr);
		return str;
	},
	getTimes: function(startDate, endDate) {
		let times = this.strToDate("yyyy-MM-dd HH:mm:ss", endDate).getTime() - this.strToDate("yyyy-MM-dd HH:mm:ss", startDate).getTime();
		times = times <= 0 ? 0 : times;
		return times;
	},
	dateDiff: function(strInterval, dtStart, dtEnd) { //计算两个日期之间的差
		switch (strInterval) {
			case 't':
				return parseInt((dtEnd - dtStart));
			case 's':
				return parseInt((dtEnd - dtStart) / 1000);
			case 'n':
				return parseInt((dtEnd - dtStart) / 60000);
			case 'h':
				return parseInt((dtEnd - dtStart) / 3600000);
			case 'd':
				return parseInt((dtEnd - dtStart) / 86400000);
			case 'w':
				return parseInt((dtEnd - dtStart) / (86400000 * 7));
			case 'm':
				return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
			case 'y':
				return dtEnd.getFullYear() - dtStart.getFullYear();
		}
	},
	secondTohms: function(mins, format) { //秒数转换为时分秒格式
		var time = parseInt(mins);
		var hours = parseInt(time / 3600);
		var min = parseInt((time - hours * 3600) / 60);
		var s = parseInt((time - hours * 3600) % 60);
		var text = "s";
		if (parseInt(hours) > 0) {
			text = 'hms';
		} else if (parseInt(min) > 0) {
			text = "ms";
		}
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (s < 10) {
			s = "0" + s;
		}
		if (format == 'hms') { //时分秒
			return hours + ": " + min + ": " + s;
		}else if (format == 'hm') { //分秒
			return hours + ": " + min;
		}else if (format == 'ms') { //分秒
			return min + ": " + s;
		}else if (format == 'array_ms') { //分秒
			return {fen:min,miao:s};
		}else if (format == 'zh') {
			if (text == "hms") {
				return hours + "小时" + min + "分" + s + "秒";
			} else if (text == "ms") {
				return min + "分" + s + "秒";
			} else {
				return mins + "秒";
			}
		} else if (format == 'english') {
			if (text == "hms") {
				return hours + ":" + min + ":" + s;
			} else {
				return min + ":" + s;
			}
		}

	}
}
export {
	TimeConvert
}
