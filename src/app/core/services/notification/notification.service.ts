import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NotificationPaginationResponse } from 'src/app/core/models/notification/notification';
import { NotificationStore } from 'src/app/stores/notification/notification-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private _http: HttpClient,
	private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

  // for getting the Report page data
	getItems(): Observable<NotificationPaginationResponse> {

		let params = '';
			params = `?type=recent`;
		
			return this._http.get<NotificationPaginationResponse>(`/users/me/notifications${(params ? params : '')}`).pipe(
				map((res: NotificationPaginationResponse) => {
					NotificationStore.setNotificationType(res);
					return res;
				})
			);
	}
	getAllItems(): Observable<NotificationPaginationResponse> {

		let params = '';
		params = `?page=${NotificationStore.currentPageAll}`
	
			return this._http.get<NotificationPaginationResponse>(`/users/me/notifications${(params ? params : '')}`).pipe(
				map((res: NotificationPaginationResponse) => {
					NotificationStore.setNotificationAll(res);
					return res;
				})
			);
	}
	unreadNotifications(): Observable<NotificationPaginationResponse> {

		let params = '';
		params = `?page=${NotificationStore.unreadCurrentPage}&type=unread`;
			return this._http.get<NotificationPaginationResponse>(`/users/me/notifications${(params ? params : '')}`).pipe(
				map((res: NotificationPaginationResponse) => {
					NotificationStore.setUnreadNotification(res);
					this.getItems().subscribe();
					// this.getAllItems().subscribe();
					return res;
				})
			);
	}

	getCount(): Observable<any> {
		return this._http.get<any>(`/users/me/notifications/un-read-count`).pipe(
			map((res: any) => {
				NotificationStore.setNotificationCount(res);
				// this.getItems().subscribe();
				// this.getAllItems().subscribe();
				return res;
			})
		);
	}

	updateStatus(id): any {
		return this._http.put(`/users/me/notifications/mark-as-read`,{notification_ids: id});
	}

	markAsRead(){
		return this._http.put(`/users/me/notifications/mark-as-read`,'');
	}	

	
}
