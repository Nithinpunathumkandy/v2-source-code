import { Pipe, PipeTransform } from '@angular/core';
import { AuthStore } from 'src/app/stores/auth.store';
@Pipe({
  name: 'permission'
})
export class PermissionPipe implements PipeTransform {
  transform(value: string, ...args: string[]): boolean {
        var returnValue: boolean;
        var pos = AuthStore.getActivityPermission(null,value);
        if(pos)
            returnValue = true;
        else
            returnValue = false;
        return returnValue;
  }
}