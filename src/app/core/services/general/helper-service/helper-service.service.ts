import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_moonrisekingdom from "@amcharts/amcharts4/themes/moonrisekingdom";
import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";
import { LabelMasterStore } from 'src/app/stores/masters/general/label-store';
import { CustomDate } from 'src/app/core/models/general/sub-menu.model';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class HelperServiceService {

	pipe = new DatePipe('en-US');
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
	dateFormat = [
		{ title: "shortDate", value: "M/d/yy" },
		{ title: "mediumDate", value: "MMM d, y" },
		{ title: "longDate", value: "MMMM d, y" },
		{ title: "dd/MM/yy", value: "dd/MM/yy" },
		{ title: "fullDate", value: "EEEE, MMMM d, y" }];
	constructor(private _router: Router) { }

	customDate: CustomDate = {} as CustomDate;
	startDate: any;
	endDate: any;

	componentName : Subject<string> = new Subject<string>()
	component:string
	/**
	 * Function to handle date selected in ngbDatepicker and also date returned from sever
	 * The selected value is an object
	 * if type is split data from server is splited and object is returned
	 * If type is join object is converted to string for saving data to server
	 */
	processDate(dt: any, type) {
		if (type == 'split') {
			if (dt != null) {
				var date = {
					year: parseInt(dt.split('-')[0]),
					month: parseInt(dt.split('-')[1]),
					day: parseInt(dt.split('-')[2])
				}
				return date;
			}
			else {
				return '';
			}
		}
		else {
			if (dt && dt.hasOwnProperty('month')) {
				let month: string = dt.month.toString();
				let day = dt.day.toString();
				if (month.length == 1)
					month = '0' + dt.month;
				if (day.length == 1)
					day = '0' + dt.day;
				var pdate = dt.year + "-" + month + "-" + day;
				return pdate;
			}
			else {
				if (!dt)
					return '';
				else
					return dt;
			}
		}
	}


	//	for getting current and previous Quarter
	getCurrentPreviousQuarter(value) {
		const today = new Date();
		const quarter = Math.floor((today.getMonth() / 3));

		switch (value) {
			case "previous":
				this.startDate = new Date(today.getFullYear() + 1, quarter * 3 - 3, 1);
				this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 3, 0);
				break;
			case "current":
				this.startDate = new Date(today.getFullYear(), quarter * 3, 1);
				this.endDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 3, 0);
				break;
			default:
				break;
		}
		return this.startDate, this.endDate;
	}


	processDates(date: Date) {
		let day = date.getUTCDate().toString();
		let month = (date.getMonth() + 1).toString();
		let year = date.getUTCFullYear().toString();
		if (day.length == 1) {
			day = '0' + day;
		}
		if (month.length == 1)
			month = '0' + month;
		return { date: day, month: month, year: year };
	}

	joinDates(dateObj: any) {
		return `${dateObj.year}-${dateObj.month}-${dateObj.date}`;
	}

	getThemes(theme) {
		let iTheme: any = null;
		switch (theme) {
			case 'am4themes_material': iTheme = am4themes_material;
				break;
			case 'am4themes_animated': iTheme = am4themes_animated;
				break;
			case 'am4themes_dataviz': iTheme = am4themes_dataviz;
				break;
			case 'am4themes_kelly': iTheme = am4themes_kelly;
				break;
			case 'am4themes_dark': iTheme = am4themes_dark;
				break;
			case 'am4themes_frozen': iTheme = am4themes_frozen;
				break;
			case 'am4themes_moonrisekingdom': iTheme = am4themes_moonrisekingdom;
				break;
			case 'am4themes_spiritedaway': iTheme = am4themes_spiritedaway;
				break;
		}
		return iTheme;
	}

	// selecting type of date range need to apply on the filtering of the data

	getStartEndDate(type: any) {
		let startDate: string;
		let endDate: string;
		let currentDate = new Date();
		let todaysDate: any = null;
		switch (type) {
			case "select":
				startDate = null;
				endDate = null;
				break;
			case "today":
				todaysDate = this.processDates(currentDate);
				startDate = this.joinDates(todaysDate);
				endDate = this.joinDates(todaysDate);
				break;
			case "week":
				todaysDate = this.processDates(currentDate);
				let lessDays = currentDate.getDay() == 0 ? 6 : currentDate.getDay();
				let wkStart = new Date(new Date(currentDate).setDate(currentDate.getDate() - lessDays));
				let firstDayofWeek = this.processDates(wkStart);
				startDate = this.joinDates(firstDayofWeek);
				endDate = this.joinDates(todaysDate);
				break;
			case "month":
				todaysDate = this.processDates(currentDate);
				startDate = this.joinDates({ date: '01', month: todaysDate.month, year: todaysDate.year })
				endDate = this.joinDates(todaysDate);
				break;
			case "quarter":
				this.getCurrentPreviousQuarter('current');
				let processQuarterStartDate = this.processDates(this.startDate);
				startDate = this.joinDates({ date: '01', month: processQuarterStartDate.month, year: processQuarterStartDate.year });
				endDate = this.joinDates(this.processDates(this.endDate));
				break;
			case "year":
				todaysDate = this.processDates(currentDate);
				startDate = this.joinDates({ date: '01', month: '01', year: todaysDate.year })
				endDate = this.joinDates(todaysDate);
				break;
			case "prevyear":
				let currentYear = currentDate.getUTCFullYear();
				let previousYear = currentYear - 1;
				startDate = this.joinDates({ date: '01', month: '01', year: previousYear });
				endDate = this.joinDates({ date: '31', month: '12', year: previousYear });
				break;
			case "prevquarter":
				this.getCurrentPreviousQuarter('previous');
				let processStartDate = this.processDates(this.startDate);
				startDate = this.joinDates({ date: '01', month: processStartDate.month, year: processStartDate.year });
				endDate = this.joinDates(this.processDates(this.endDate));
				break;
			case "prevmonth":
				let previousMonth = (currentDate.getMonth()).toString();
				if(previousMonth == '0') previousMonth = "12";
				if (previousMonth.length == 1) previousMonth = `0${previousMonth}`
				startDate = this.joinDates({ date: '01', month: previousMonth, year: previousMonth == "12" ? (currentDate.getUTCFullYear()-1).toString() : currentDate.getUTCFullYear().toString()});
				let endDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate().toString();
				let day = endDay.length == 1 ? `0${endDay}` : endDay;
				endDate = this.joinDates({ date: day, month: previousMonth, year: previousMonth == "12" ? (currentDate.getUTCFullYear()-1).toString() : currentDate.getUTCFullYear().toString() });
				break;
			case "prevweek":
				let lastWeekDate = new Date(currentDate.getUTCFullYear(), currentDate.getMonth(), currentDate.getUTCDate() - 7);
				//console.log(lastWeekDate);
				let firstDayofLastWeek = (lastWeekDate.getDate() - lastWeekDate.getDay()).toString();
				const checkFirstdayWeek=firstDayofLastWeek
				if (firstDayofLastWeek.length == 1) firstDayofLastWeek = `0${firstDayofLastWeek}`;
				// console.log(currentDate.getMonth());
				let lastDayofLastWeek = (lastWeekDate.getDate() - (lastWeekDate.getDay() - 1) + 5).toString();
				const checkLastDate=lastDayofLastWeek;
				
				//console.log(lastDayofLastWeek)
				if (lastDayofLastWeek.length == 1) lastDayofLastWeek = `0${lastDayofLastWeek}`;
				let lastWeekProcessed = this.processDates(lastWeekDate);
				startDate = this.joinDates({ date: firstDayofLastWeek, month: lastWeekProcessed.month, year: lastWeekProcessed.year });
				if(Number(checkLastDate)>new Date(currentDate.getUTCFullYear(), currentDate.getMonth(), 0).getDate()) 
				{  
					let newdate=new Date(startDate);
					// console.log(newdate) 
					// console.log(new Date(newdate.setDate(newdate.getDate() + Number(checkLastDate)-Number(checkFirstdayWeek))).getDate());
					endDate = this.joinDates({ date: `0${new Date(newdate.setDate(newdate.getDate() + Number(checkLastDate)-Number(checkFirstdayWeek))).getDate()}`, month: currentDate.getMonth()+1, year: currentDate.getUTCFullYear() });
				}
				else
				{
					endDate = this.joinDates({ date: lastDayofLastWeek, month: lastWeekProcessed.month, year: lastWeekProcessed.year });
				}
				break;
			case "yesterday":
				currentDate.setDate(currentDate.getDate() - 1);
				startDate = this.joinDates(this.processDates(currentDate));
				endDate = this.joinDates(this.processDates(currentDate));
				break;
			default:
				break;
		}
		this.customDate.startDate = startDate;
		this.customDate.endDate = endDate;
		return { startDate: startDate, endDate: endDate };
	}


	// Function to remove base64 string from image object prior to saving data
	removePreviewObject(type, data) {
		if (type == 'logo') {
			if (data.hasOwnProperty('preview')) {
				delete data.preview;
				return data;
			}
			else
				return data;
		}
		else {
			for (let i of data) {
				if (i.hasOwnProperty('preview')) {
					delete i.preview;
				}
			}
			return data;
		}
	}
	getDateFormatType() {
		var value;
		    //take date value
			this.dateFormat.forEach(element => {
			if(element.title == OrganizationGeneralSettingsStore.organizationSettings?.date_format){
				 value = element.value	
			}
		  });
		  return value;
	}
	// Returns Todays Date as Object
	getTodaysDateObject() {
		var dt = new Date();
		var dateObj = {
			year: dt.getFullYear(),
			quarter: Math.floor((dt.getMonth() + 3) / 3),
			month: dt.getMonth() + 1,
			day: dt.getDate(),
			weekday: dt.getDay(),
			week: Math.ceil((dt.getDate() + 6 - dt.getDay()) / 7)

		}
		return dateObj;
	}

	/**
	 * 
	 * @param progress File Upload Progress
	 * @param file Selected File
	 * @param success Boolean value whether file upload success 
	 */
	assignFileUploadProgress(progress, file, success = false, fileUploadsArray) {
		if (!success) {
			for (let i of fileUploadsArray) {
				if (i.name == file.name && i.position == file.position) {
					i['uploadProgress'] = progress;
				}
			}
		}
		else {
			for (let i of fileUploadsArray) {
				if (i.name == file.name && i.position == file.position) {
					i['success'] = true;
				}
			}
		}
		return fileUploadsArray;
	}

	// Checks whether any image for logo is being uploaded or not
	checkLogoIsUploading(fileUploadsArray) {
		for (let i of fileUploadsArray) {
			if (i.file_type == 'logo' && i.success == false) {
				return true;
			}
		}
		return false;
	}

	// Checks whether any upload is going on or not
	checkFileisUploaded(fileUploadsArray) {
		for (let i of fileUploadsArray) {
			if (i.success == false) {
				return true;
			}
		}
		return false;
	}

	checkFileisUploadedCount(fileUploadsArray) {
		let count = 0;
		for (let i of fileUploadsArray) {
			if (i.success == false) {
				count++;
			}
		}
		return count;
	}

	/**
	 * 
	 * @param files Selected files array
	 * @param type type of selected files - logo or brochure
	 */
	addItemsToFileUploadProgressArray(files, type, fileUploadsArray) {
		for (let i of files) {
			i['position'] = fileUploadsArray.length;
			i['uploadProgress'] = 0;
			i['success'] = false;
			i['file_type'] = type;
			fileUploadsArray.unshift(i);
		}
		return { 'files': files, 'fileUploadsArray': fileUploadsArray };
	}

	daysFromDate(dayOne, dayTwo) {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		var date1 = new Date(dayOne);
		var date2 = new Date(dayTwo);
		// To calculate the time difference of two dates 
		if (date1.getTime() < date2.getTime()) {
			var Difference_In_Time = date2.getTime() - date1.getTime();
		}
		else {
			var Difference_In_Time = date1.getTime() - date2.getTime();
		}
		// To calculate the no. of days between two dates 
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
		return Difference_In_Days;
	}

	getDatesDifference(dayOne, dayTwo){
		var date1 = new Date(dayOne);
		var date2 = new Date(dayTwo);
		// To calculate the time difference of two dates 
		var differenceInTime = date2.getTime() - date1.getTime();
		var differenceInDays = differenceInTime / (1000 * 3600 * 24);
		return differenceInDays;
	}

	yearDifferenceFromDate(dayOne, dayTwo) {

		let days = this.daysFromDate(dayOne, dayTwo);
		return Math.floor(days / 365);
	}

	daysConversion(days) {
		let years = Math.floor(days / 365);
		let daymod = days % 365;
		let month = Math.floor((daymod) / 30);
		let day = Math.floor((daymod) % 30);
		let result = '';
		if (years > 0) {
			if (years > 1)
				result = result + years + ' years ';
			else result = result + years + ' year ';

		}
		if (month > 0) {
			
			if (month > 1)
				result = result + month + ' months ';
			else result = result + month + ' month ';

		}
		if (day > 1)
			result = result + day + ' days';
		else result = result + day + ' day';
		return result;

	}

	createStringFromArray(array: any[]) {
		return array.toString();
	}

	getColorClass(index) {
		var colors = [
			{ text: 'brown-text-color', bg: 'brown-bg-color' },
			{ text: 'light-blue-text-color', bg: 'light-blue-bg-color' },
			{ text: 'blue-text-color', bg: 'blue-bg-color' },
			{ text: 'yellow-text-color', bg: 'yellow-bg-color' },
			{ text: 'dark-green-text-color', bg: 'dark-green-bg-color' },
			{ text: 'dark-blue-text-color', bg: 'dark-blue-bg-color' },
			{ text: 'light-green-text-color', bg: 'light-green-bg-color' },
			{ text: 'dark-wayalat-text-color', bg: 'dark-wayalat-bg-color' },
			{ text: 'dark-blue-new-text-color', bg: 'dark-blue-new-bg-color' },
			{ text: 'dark-orange-text-color', bg: 'dark-orange-bg-color' },
		]
		var temp = null;
		if (index.toString().length > 1)
			temp = parseInt(index.toString()[1]);
		else
			temp = index;
		return colors[temp];
	}

	/**
	 * Check Which browser is being used
	 */
	checkBrowser() {
		let userAgent = navigator.userAgent.toLowerCase();
		if (userAgent.indexOf('trident') == -1 && userAgent.indexOf('edge') == -1)
			return false;
		else
			return true;
	}

	/**
	 * 
	 * @param seperator Seperator string
	 * @param field object to be selected
	 * @param items Array of items
	 */
	getArraySeperatedString(seperator, field, items) {
		if (items && items.length > 0 && items[0]?.hasOwnProperty(field)) {
			var result = items.map(function (val) {
				return val[field];
			}).join(seperator);
			return result;
		}
		else {
			return AppStore.noContentText;
		}
	}

	/**
	 * Creates Parameter string from array
	 * @param paramsArray Array to be processed
	 */
	createParameterFromArray(paramsArray: any) {
		if (paramsArray && paramsArray.length > 0) {
			let paramsString = paramsArray.reduce((p, c) => {
				p += (p != '') ? ',' + (c ? c.id : '') : (c ? c.id : '');
				return p;
			}, [])
			return paramsString;
		}
		else {
			return '';
		}
	}

	/**
	 * Check permission for submenu items and set it in SubMenuItemStore
	 * @param moduleGroupId module Group Id
	 * @param subMenuItems Sub Menu Items to Check
	 */
	checkSubMenuItemPermissions(moduleGroupId: number, subMenuItems: any[]) {
		var allowedSubMenuItems = [];
		for (let i of subMenuItems) {
			if (i.activityName && AuthStore.getActivityPermission(moduleGroupId, i.activityName))
				allowedSubMenuItems.push(i.submenuItem);
			else if (!i.activityName)
				allowedSubMenuItems.push(i.submenuItem);
		}
		SubMenuItemStore.setSubMenuItems(allowedSubMenuItems);
	}

	checkIntroItemPermissions(subMenuItems: any[], introItems: any[]) {
		if(subMenuItems.length > 0){
			for (let i of subMenuItems) {
				if (i.activityName && !AuthStore.getActivityPermission(null, i.activityName)) {
					let pos = introItems.findIndex(e => e.element == '#' + i.submenuItem.type);
					introItems.splice(pos, 1);
				}
			}
			return introItems;
		}
		else{
			return [];
		}
	}

	getArrayProcessed(valuesArray, processObject) {
		var returnArray = [];
		if (processObject) {
			if (valuesArray && valuesArray.length > 0) {
				for (let i of valuesArray) {
					if (i) returnArray.push(i[processObject]);
				}
			}
		}
		else {
			if (valuesArray && valuesArray.length > 0) {
				for (let i of valuesArray) {
					if (i) returnArray.push(i);
				}
			}
		}
		return returnArray;
	}

	processPivotArray(valuesArray, processObject) {
		var returnArray = [];
		if (valuesArray && valuesArray.length > 0) {
			for (let i of valuesArray) {
				let obj = { id: i.id };
				obj[processObject] = i.language[0].pivot['title'];
				returnArray.push(obj);
			}
		}
		return returnArray;
	}

	checkMasterUrl() {
		if (this._router.url.indexOf('masters') != -1)
			return true;
		else
			return false;
	}

	// Highlight text
	highLighText(value, args) {
		if (args && value) {
			let startIndex = value.toLowerCase().indexOf(args.toLowerCase());
			if (startIndex != -1) {
				let endLength = args.length;
				let matchingString = value.substr(startIndex, endLength);
				return value.replace(matchingString, "<mark>" + matchingString + "</mark>");
			}

		}
		return value;
	}

	//check data with title
	checkDataWithTitle(data, keyval) {
		data = Object.assign([], data.data).filter(
			item => item.faq_language_title.toLowerCase().indexOf(keyval.toLowerCase()) > -1
		)
		return data;
	}

	translateToUserLanguage(text) {
		var translatedText = text;
		if (LabelMasterStore.getLabelsToTranslate && LabelMasterStore.getLabelsToTranslate.hasOwnProperty(text))
			translatedText = LabelMasterStore.getLabelsToTranslate[text];
		return translatedText;
	}


	timeZoneFormatted(dateTime?) {
		if (AppStore.appTimeZone) {
			var formattedTime = '';
			// dateTime = '2021-07-28T06:11:20.000000Z';
			if (dateTime) {
				let formattedDateTime = dateTime;
				if (typeof dateTime == "string" && dateTime.indexOf('T') != -1) {
					var d = new Date(dateTime);
					// get UTC time in msec
					// var utc = d.getTime();
					var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
					// create new Date object for different city
					// using supplied offset
					let utcoff = parseFloat(AppStore.appTimeZoneUTC);
					var nd = new Date(utc + (3600000 * utcoff));
					formattedTime = nd.toLocaleString();
					// formattedDateTime = dateTime.replace('T',' ');
					// let splitDate = formattedDateTime.split('.');
					// formattedDateTime = splitDate[0];
				}
				else
					formattedTime = new Date(formattedDateTime).toLocaleString('en-US', { timeZone: AppStore.appTimeZone });
				// console.log(new Date(formattedDateTime).toISOString());
			}
			else
				formattedTime = new Date().toLocaleString('en-US', { timeZone: AppStore.appTimeZone });
			return this.processLocalDateString(formattedTime);
		}
		else {
			if (dateTime) return dateTime;
			else return this.processLocalDateString(new Date().toLocaleString());
		}
	}


	processLocalDateString(formattedTime) {
		// let lcase = formattedTime.toLowerCase();
		// console.log(formattedTime)
		// 7/28/2021, 3:38:16 PM
		// 27/7/2021, 6:42:55 pm - Firefox
		let fsplit = formattedTime.split(', ');
		let dtsplit = fsplit[0].split('/');
		let month, day;
		if (navigator.userAgent.indexOf("Firefox") != -1) {
			month = dtsplit[1].length == 1 ? '0' + dtsplit[1] : dtsplit[1];
			day = dtsplit[0].length == 1 ? '0' + dtsplit[0] : dtsplit[0];
		}
		else {
			month = dtsplit[0].length == 1 ? '0' + dtsplit[0] : dtsplit[0];
			day = dtsplit[1].length == 1 ? '0' + dtsplit[1] : dtsplit[1];
		}
		let tmsplit = fsplit[1].split(':');
		let ampm = tmsplit[2].split(' ');
		let hours = tmsplit[0];
		let minutes = tmsplit[1].length == 1 ? '0' + tmsplit[1] : tmsplit[1];
		let seconds = ampm[0].length == 1 ? '0' + ampm[0] : ampm[0];
		if ((ampm[1] == 'PM' || ampm[1] == 'pm') && parseInt(hours) < 12) hours = (parseInt(hours) + 12).toString();
		// console.log(parseInt(month)-1);
		let dt = new Date(parseInt(dtsplit[2]), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
		// console.log(dt);
		return dt;
		// let dt = formattedTime.toLocaleLowerCase().replace(', ','T').replace(' am','Z').replace(' pm','Z');
		// let spltdt = dt.split('/');
		// let join_date = spltdt.join('-');
		// let datesplit = join_date.split('T');
		// let yymmdd = datesplit[0].split('-');
		// if(yymmdd[1].length == 1) yymmdd[1] = '0'+yymmdd[1];
		// if(yymmdd[0].length == 1) yymmdd[0] = '0'+yymmdd[0];
		// let hhmm = datesplit[1].split(':');
		// // if(hhmm[0].length == 1) hhmm[0] = '0'+hhmm[0];
		// hhmm[0] =  this.convertTo24Hour(hhmm[0],formattedTime.indexOf('am') ? 'am' : 'pm');
		// if(hhmm[0].length == 1) hhmm[0] = '0'+hhmm[0];
		// if(hhmm[1].length == 1) hhmm[1] = '0'+hhmm[1];
		// // if(hhmm[0].length == 1) hhmm[0] = '0'+hhmm[0];
		// let newDate = yymmdd[2]+'-'+yymmdd[0]+'-'+yymmdd[1];
		// let newTime = hhmm.join(':');
		// let prDate = newDate+'T'+newTime; 
		// console.log(prDate);
		// return prDate;
	}

	convertTo24Hour(time, ampm) {
		var hours = parseInt(time.substr(0, 2));
		if (ampm.indexOf('am') != -1 && hours == 12) {
			time = time.replace('12', '0');
		}
		if (ampm.indexOf('pm') != -1 && hours < 12) {
			time = time.replace(hours, (hours + 12));
		}
		return time.replace(/(am|pm)/, '');
	}



	/**
	 * 
	 * @param charactersArray array of strings
	 * @param characterLength total length of the strings required
	 * @param seperator what seperator between each string
	 */
	getFormattedName(charactersArray: string[], characterLength: number, seperator: string) {
		
		if (charactersArray.length > 0 && !this.checkForNullInArray(charactersArray)) {
			let nameString = this.getStringFromArray(charactersArray, seperator);
			if (nameString.length > characterLength)
				return nameString.slice(0, characterLength) + '...';
			else
				return nameString;
		}
		else
			return ''
	}

	checkForNullInArray(carray: string[]) {
		// var nullPresent = false;
		// for (var i = 0; i < carray.length; i++) {
		// 	if (carray[i] == null) {
		// 		nullPresent = true;
		// 		break;
		// 	}
		// }
		// return nullPresent;
		var nullPresent = 0;
		for (var i = 0; i < carray.length; i++) {
			if (carray[i] == null) {
				nullPresent++;
			}
		}
		if(nullPresent == carray.length) return true;
		else return false;
	}

	getStringFromArray(array: string[], seperator) {
		let formattedString = '';
		for (let i of array) {
			if(i)
				formattedString = (formattedString == '') ? i : `${formattedString}${seperator}${i}`;
		}
		return formattedString;
	}

	passSaveFormatDate(date) {
		const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
		return fromdate;
	}

	passSaveFormatDateOnTimeTracker(date) {
		const fromdate = this.pipe.transform(date, 'yyyy-MM-dd');
		return fromdate;
	}

	formatTimer(dt) {
		var timer = {
			hour: parseInt(dt.split(':')[0]),
			minute: parseInt(dt.split(':')[1]),
			seconds: parseInt(dt.split(':')[2]),
		}
		return timer
	}

	//  For Sorting KHFiles and System Files into proper Format
	sortFileuploadData(Files, type, module?) {
		let processedArray = [];
		if (type == 'save') {
			Files.forEach(element => {
				if (element.hasOwnProperty('id') && element.id) {
					if (module == "KH") {
						processedArray.push({
							'related_document_id': element.id,
							'name': null,
							'size': null,
							'url': null,
							'ext': null,
							'thumbnail_url': null,
							'is_new': true,
						})
					}
					else {
						processedArray.push({
							'document_id': element.id,
							'name': null,
							'size': null,
							'url': null,
							'ext': null,
							'thumbnail_url': null,
							'is_new': true,
						})
					}

				} else {

					if (module == 'KH') {
						processedArray.push({
							...element,
							'related_document_id': null
						}
						)
					}
					else {
						processedArray.push({
							...element,
							'document_id': null
						}
						)
					}

				}
			});
		} else {


		}

		return processedArray;
	}

	// Compare 
	compareEditDataWithSelectedData(comparisonFiles, selectedKHFiles, selectedSystemFiles) {


		//To return newly added items other than the already available data.
		var newItems = selectedKHFiles.filter(function (obj) {
			return !comparisonFiles.some(function (obj2) {
				return obj.token == obj2.token;
			});
		});

		//To find the deleted data by comparing both comparison array and available data.
		var deletedItems = comparisonFiles.filter(function (obj) {
			return !selectedKHFiles.some(function (obj2) {
				return obj.token == obj2.token;
			});
		});

		// To find the unedited items by comparing both comparison array and already available data 
		var unEditedItems = comparisonFiles.filter(function (obj) {
			return selectedKHFiles.some(function (obj2) {
				return obj.token == obj2.token;
			});
		});
		

		var newDocuments = []
		var deletedDocuments = []

		newItems.forEach(element => {

			newDocuments.push({
				"document_id": element.id,
				"is_new": true,
				'name': null,
				'size': null,
				'url': null,
				'ext': null,
				'thumbnail_url': null
			})

		});
		deletedItems.forEach(element => {

			deletedDocuments.push({
				"document_id": element.document_id,
				"id": element.updateId,
				"is_deleted": true,
				'name': null,
				'size': null,
				'url': null,
				'ext': null,
				'thumbnail_url': null
			})

		});

		// Adding default document_id as null for systemFiles.
		selectedSystemFiles.map(function (e) {
			e['document_id'] = null;
		});
		let result = [...newDocuments, ...deletedDocuments, ...unEditedItems, ...selectedSystemFiles]

		return result
	}

	getDateDifference(dateOne,dateTwo?){

		let todayDate=dateTwo?new Date(dateTwo):new Date()
		let reviewDate=new Date(dateOne)
		 // One day in milliseconds
		 const oneDay = 1000 * 60 * 60 * 24;

		 // Calculating the time difference between two dates
		 const diffInTime = reviewDate.getTime() - todayDate.getTime();
	 
		 // Calculating the no. of days between two dates
		 const diffInDays = Math.round(diffInTime / oneDay);
		 return diffInDays

	}

	getTypeCastedValue(value){
		let _typecastedValue = typeof(value)=='string'?parseInt(value):value

		return _typecastedValue
	}

	processTime(vanilaTime,staticDate:boolean=false){

		// To Process time  generated from date/time picker into AM/PM Format
		// Static Date added to reformat our data from server to the one in ng date/time picker format.

		let mergedDate=staticDate?new Date('01 Jan 1978 '+vanilaTime):new Date(vanilaTime)

		const formattedTime = mergedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
			return formattedTime
	}

	setComponent(name){
		this.component = name
		this.componentName.next(this.component)
	}
		
	lineBreakCount(str){
		try {
			return((str.match(/[^\n]*\n[^\n]*/gi).length));
		} catch(e) {
			return 0;
		}
	}

}
