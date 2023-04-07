
import { observable, action, computed } from "mobx-angular";

import { Notification,NotificationPaginationResponse } from 'src/app/core/models/notification/notification';


class Store {
    @observable
    private _notification: Notification[] = [];

    @observable
    private _unreadNotification: Notification[] = [];

    @observable
    private _allNotification: Notification[] = [];

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    currentPageAll: number = 1;

    @observable
    unreadCurrentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    itemsPerPageAll: number = null;

    @observable
    unreadItemsPerPage: number = null;

    @observable
    orderItem: string = 'notification_title';

    @observable
    totalItems: number = null;

    @observable
    totalNotificationItems: number = null;

    @observable
    unreadTotalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedId: number = null;

    searchText: string;

    @observable
    selectedReportObject: Notification = null;

    @observable
    notificationloaded: boolean = false;

    @observable
    notificationAllloaded: boolean = false;

    @observable
    unreadNotificationloaded: boolean = false;

    @observable
    notificationCount: any = 0;

    @action
    setNotificationDetails(response: any) {
        this._notification = response;
        this.notificationloaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setCurrentPageAll(current_page: number) {
        this.currentPageAll = current_page;
    }

    @action
    unreadSetCurrentPage(current_page: number) {
        this.unreadCurrentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setNotificationType(response: NotificationPaginationResponse) {
        this._notification = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.notificationloaded = true;
    }

    @action
    setNotificationAll(response: NotificationPaginationResponse) {
        this._allNotification = response.data;
        this.currentPageAll = response.current_page;
        this.itemsPerPageAll = response.per_page;
        this.totalNotificationItems = response.total;
        this.from = response.from;
        this.notificationAllloaded = true;
    }

    @action
    setUnreadNotification(response: NotificationPaginationResponse) {
        this._unreadNotification = response.data;
        this.unreadCurrentPage = response.current_page;
        this.unreadItemsPerPage = response.per_page;
        this.unreadTotalItems = response.total;
        this.from = response.from;
        this.unreadNotificationloaded = true;
    }

    @action
    setNotificationCount(response : any) {
       
        this.notificationCount = response;
        
    }
    
    @computed
    get allItems(): Notification[] {
        
        return this._notification.slice();
    }

    @computed
    get allNotificationItems(): Notification[] {
        
        return this._allNotification.slice();
    }

    @computed
    get unreadAllItems(): Notification[] {
        
        return this._unreadNotification.slice();
    }

    @computed
    get notificationcount(): any {

        return this.notificationCount
    }
    
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getNotificationById(id: number): Notification {
        return this._notification.slice().find(e => e.id == id);
    }

    @action
    makeEmpty() {
        this._notification = [];
    }
  
}

export const NotificationStore = new Store();

