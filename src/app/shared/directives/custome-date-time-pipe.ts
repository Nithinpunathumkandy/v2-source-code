import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DateTimePipe'
})
export class DateTimeTransformPipe extends DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
      return super.transform(value, args);
    }

}