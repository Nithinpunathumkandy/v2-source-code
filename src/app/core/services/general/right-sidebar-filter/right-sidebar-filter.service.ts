import { Injectable, EventEmitter } from '@angular/core';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { EventEmitterService } from '../event-emitter/event-emitter.service';
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RightSidebarFilterService {
  private _filterChangedTimeout = null;
  ngmodalChangeEmitter: EventEmitter<string> = new EventEmitter();
  private filterMessage = new Subject<any>();
  constructor(
    private _eventEmitterService: EventEmitterService,
  ) { }

  setFiltersForCurrentPage(filters: string[]) {
    const yearIndex = filters.findIndex(e => e == 'year');
    if (yearIndex == -1) filters.push('year');

    const monthIndex = filters.findIndex(e => e == 'month');
    if (monthIndex == -1) filters.push('month');

    const quarterIndex = filters.findIndex(e => e == 'quarter');
    if (quarterIndex == -1) filters.push('quarter');

    RightSidebarLayoutStore.setFiltersForCurrentPage(filters);
  }

  setOrUnsetFilterItem(item: string, value: any) {
    if (typeof (value) == 'string') {
      // if (item == 'status') {
      //   if (RightSidebarLayoutStore.isFilterSelected(item, value)) {
      //     UsersStore.selectedStatus = 'all';
      //     RightSidebarLayoutStore.unsetFilterItem(item, value);
      //     RightSidebarLayoutStore.unsetFilterValue(item, value)
      //   }
      //   else {
      //     RightSidebarLayoutStore.unsetFilterItem(item, value);
      //     RightSidebarLayoutStore.unsetFilterValue(item, value);
      //     UsersStore.selectedStatus = value;
      //     RightSidebarLayoutStore.setFilterItem(item, value);
      //     RightSidebarLayoutStore.setFilterValue(item, value);
      //   }
     

      // }

      if (RightSidebarLayoutStore.isFilterSelected(item, value)) {
        RightSidebarLayoutStore.unsetFilterItem(item, value);
        RightSidebarLayoutStore.unsetFilterValue(item, value)
      }
      else {
        RightSidebarLayoutStore.setFilterItem(item, value);
        RightSidebarLayoutStore.setFilterValue(item, value);
      }
    }
    if (typeof (value) != 'number') {
      if (RightSidebarLayoutStore.isFilterSelected(item, value.id)) {
        RightSidebarLayoutStore.unsetFilterItem(item, value.id);
        RightSidebarLayoutStore.unsetFilterValue(item, value.id);
        setTimeout(() => {
          this.ngmodalChangeEmitter.emit(item);
        }, 150);
      }
      else {
        RightSidebarLayoutStore.setFilterItem(item, value.id);
        RightSidebarLayoutStore.setFilterValue(item, value);
      }
    }
    else {
      if (item == 'is_functional') {
        RightSidebarLayoutStore.unsetFilterItem('is_corporate', value);
        RightSidebarLayoutStore.unsetFilterValue('is_corporate', value)
      }
      if (item == 'is_corporate') {
        RightSidebarLayoutStore.unsetFilterItem('is_functional', value);
        RightSidebarLayoutStore.unsetFilterValue('is_functional', value)
      }
      if(item == 'is_active'){
        RightSidebarLayoutStore.unsetFilterItem('is_passive', value);
        RightSidebarLayoutStore.unsetFilterValue('is_passive', value)
      }
      if(item == 'is_passive'){
        RightSidebarLayoutStore.unsetFilterItem('is_active', value);
          RightSidebarLayoutStore.unsetFilterValue('is_active', value)
      }
      // if(item!='status'){
        if (RightSidebarLayoutStore.isFilterSelected(item, value)) {
          RightSidebarLayoutStore.unsetFilterItem(item, value);
          RightSidebarLayoutStore.unsetFilterValue(item, value)
        }
        else {
          RightSidebarLayoutStore.setFilterItem(item, value);
          RightSidebarLayoutStore.setFilterValue(item, value);
        }
      // }

     
    }

    this.emitSidebarFilterChanged();
  }

  unsetFilterItemValues(item) {
    RightSidebarLayoutStore.unsetFilterItemValues(item);
    this.emitSidebarFilterChanged();
  }

  emitSidebarFilterChanged() {
    if (this._filterChangedTimeout) clearTimeout(this._filterChangedTimeout);

    this._filterChangedTimeout = setTimeout(() => {
      this._filterChangedTimeout = null;
      this._eventEmitterService.sidebarFilterChanged.emit();
    }, 2000);
  }

  emitFilterChange() {
    this._eventEmitterService.sidebarFilterChanged.emit();
  }

  resetFilter() {
    RightSidebarLayoutStore.resetFiltersForCurrentPage();
  }

  sendFilterEnableMessage(flag: boolean) {
    this.filterMessage.next({ value: flag});
  }

  disableFilter(flag: boolean) {
    this.filterMessage.next({ value: flag});
  }

  getFilterEnableMessage(): Observable<any> {
    return this.filterMessage.asObservable();
  }

}
