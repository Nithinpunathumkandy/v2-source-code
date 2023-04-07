import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name:'order_by'
})
export class SortPipe implements PipeTransform {

  transform(value: any, propName: string) {
      if(value){
        return value.sort((a,b) => {
            if(a[propName] < b[propName]) {
              return -1
            }
            else if (a[propName] === b[propName]) {
              return 0;
            }
            else if(a[propName] > b[propName]) {
              return 1;
            }
          });
      }
      else{
          return []
      }
  }
}