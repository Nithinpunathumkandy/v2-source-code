import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], args: any[]): any {
        if(args[0])
            return items.filter(item => item[args[1]].indexOf(args[0]) !== -1 || item[args[2]].indexOf(args[0]) !== -1 );
        else
            return items
    }
}