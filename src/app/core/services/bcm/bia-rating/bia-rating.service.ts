import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaRating, BiaRatingStorePaginationResponse, IndividualBiaRating } from 'src/app/core/models/bcm/bia-rating/bia-rating';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BiaRatingService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService,
              ) { }

              getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaRatingStorePaginationResponse> {
                let params = '';
                if (!getAll) {
                  params = `?page=${BiaRatingStore.currentPage}`;
                  if (BiaRatingStore.orderBy) params += `&order=${BiaRatingStore.orderBy}`;
                  if (BiaRatingStore.orderItem) params += `&order_by=${BiaRatingStore.orderItem}`;
                  if (BiaRatingStore.searchText) params += `&q=${BiaRatingStore.searchText}`;
                }
            
                if(additionalParams){
                  params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
                }
                if (status) params += (params ? '&' : '?')+'status=all';
                if(BiaRatingStore.searchText) params += (params ? '&q=' : '?q=')+BiaRatingStore.searchText;
                return this._http.get<BiaRatingStorePaginationResponse>('/bia-impact-ratings' + (params ? params : '')).pipe(
                  map((res: BiaRatingStorePaginationResponse) => {
                    BiaRatingStore.setBiaRatingStoreDetails(res);
                    return res;
                  })
                );
              }
            
              getItem(id: number): Observable<IndividualBiaRating> {
                return this._http.get<IndividualBiaRating>('/bia-impact-ratings/' + id).pipe(
                  map((res: IndividualBiaRating) => {
                    BiaRatingStore.setIndividualBiaRatingDetails(res);
                   
                    return res;
                  })
                );
              }
            
              updateItem(rating_id:number, rating): Observable<any> {
                return this._http.put('/bia-impact-ratings/'+ rating_id, rating).pipe(
                  map(res => {
                    this._utilityService.showSuccessMessage('success', 'bia_rating_updated');
                    
                    this.getItems(false,null,true).subscribe();
            
                    return res;
                  })
                );
              }
            
              saveItem(item): Observable<any> {
                return this._http.post('/bia-impact-ratings', item).pipe(
                  map(res => {
                    this._utilityService.showSuccessMessage('success', 'bia_rating_added');
                    this.getItems(false,null,true).subscribe();
                    return res;
                  })
                );
              }
            
              delete(id: number) {
                return this._http.delete('/bia-impact-ratings/' + id).pipe(
                  map(res => {
                    this._utilityService.showSuccessMessage('success', 'bia_rating_deleted');
                    this.getItems(false,null,true).subscribe();
                    return res;
                  })
                );
              }

              activate(id: number) {
                return this._http.put('/bia-impact-ratings/' + id + '/activate', null).pipe(
                  map(res => {
                    this._utilityService.showSuccessMessage('success', 'bia_rating_activated');
                    this.getItems(false,null,true).subscribe();
                    return res;
                  })
                );
              }
            
              deactivate(id: number) {
                return this._http.put('/bia-impact-ratings/' + id + '/deactivate', null).pipe(
                  map(res => {
                    this._utilityService.showSuccessMessage('success', 'bia_rating_deactivated');
                    this.getItems(false,null,true).subscribe();
                    return res;
                  })
                );
              }
            
              generateTemplate() {
                this._http.get('/bia-impact-ratings/template', { responseType: 'blob' as 'json' }).subscribe(
                  (response: any) => {
                    this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_rating_template') + ".xlsx");
                  }
                )
              }
            
              exportToExcel() {
                let params = '';
                if (BiaRatingStore.orderBy) params += `?order=${BiaRatingStore.orderBy}`;
                if (BiaRatingStore.orderItem) params += `&order_by=${BiaRatingStore.orderItem}`;
                // if (BiaRatingStore.searchText) params += `&q=${BiaRatingStore.searchText}`;
                // if(RightSidebarLayoutStore.filterPageTag == 'incident_corrective' && RightSidebarLayoutStore.filtersAsQueryString)
                //   params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
                this._http.get('/bia-impact-ratings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
                  (response: any) => {
                    this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bia_rating') + ".xlsx");
                  }
                )
              }

          
              importData(data){
                const formData = new FormData();
                formData.append('file',data);
                return this._http.post('/bia-impact-ratings/import',data).pipe(
                  map((res:any )=> {
                    this._utilityService.showSuccessMessage('success','bia_rating_imported');
                    this.getItems(false,null,true).subscribe();
                    return res;
                  })
                )
              }
          
              searchBiaRating(params){
                return this.getItems(params ? params : '').pipe(
                  map((res: BiaRatingStorePaginationResponse) => {
                    BiaRatingStore.setBiaRatingStoreDetails(res);
                    return res;
                  })
                );
              }

              shareData(data) {
                return this._http.post('/bia-impact-ratings/share', data).pipe(
                  map((res: any) => {
                    this._utilityService.showSuccessMessage('success', 'bia_rating_shared');
                    return res;
                  })
                )
              }

              
              sortBiaRatingList(type:string, text:string) {
                if (!BiaRatingStore.orderBy) {
                  BiaRatingStore.orderBy = 'asc';
                  BiaRatingStore.orderItem = type;
                }
                else{
                  if (BiaRatingStore.orderItem == type) {
                    if(BiaRatingStore.orderBy == 'asc') BiaRatingStore.orderBy = 'desc';
                    else BiaRatingStore.orderBy = 'asc'
                  }
                  else{
                    BiaRatingStore.orderBy = 'asc';
                    BiaRatingStore.orderItem = type;
                  }
                }
              }
}
