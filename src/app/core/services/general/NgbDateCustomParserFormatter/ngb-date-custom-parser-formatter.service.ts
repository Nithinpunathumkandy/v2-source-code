import { DatePipe, formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

@Injectable({
  providedIn:'root'
})
export class NgbDateCustomParserFormatterService extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = {
        day: <any>null,
        month: <any>null,
        year: <any>null,
      };
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    // let datePipe = new DatePipe('en-US');
    let Data:string='';

    if(date){
      
      let elementDate:string=date.year+'-'+date.month+'-'+date.day;
      
      Data=formatDate(elementDate, OrganizationGeneralSettingsStore?.organizationSettings?.date_format, 'en-US');
      // Data=datePipe.transform(date.day-date.month-date.year, OrganizationGeneralSettingsStore?.organizationSettings?.date_format); 
    }
    
    return Data
      ? Data
      : '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatterService.formatDate(date);
  }
}
