import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IsmsInherentRating, IsmsResidualRiskRating, IsmsRisk, IsmsRiskAgeningStatusCount, IsmsRiskAssetCriticality, IsmsRiskCategories, IsmsRiskCount, IsmsRiskDepartments, IsmsRiskHeatMap, IsmsRiskOwners, IsmsRiskSections, IsmsRiskSource, IsmsRiskStatuses, IsmsRiskTreatmentProgressCount } from 'src/app/core/models/isms/dashboard/isms-dashboard';
import { ISMSDashboardStore } from 'src/app/stores/isms/dashboard/isms-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class IsmsDashboardService {

  constructor(
    private _http: HttpClient,

  ) { }

   /**
   * @description
   * This method is used for getting risk details.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */
  getRisk(getAll: boolean=false, additionalParams): Observable<IsmsRisk> {
    let params: string = '';
    if(!getAll)
      params = `?page=${ISMSDashboardStore.currentPage}&limit=10`;
      if(additionalParams) params += additionalParams;
    return this._http.get<IsmsRisk>('/dashboard/isms-risk' +(params ? params : '')).pipe((
      map((res:IsmsRisk)=>{
        ISMSDashboardStore.setIsmsRisk(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting isms risk counts.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */
  getIsmsRiskCount(): Observable<IsmsRiskCount> {
    return this._http.get<IsmsRiskCount>('/dashboard/isms-risk-count').pipe((
      map((res:IsmsRiskCount)=>{
        ISMSDashboardStore.setIsmsRiskCount(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting isms inherent rating
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */
  getIsmsInherentRating(): Observable<IsmsInherentRating[]> {
    return this._http.get<IsmsInherentRating[]>('/dashboard/isms-risk-count-by-inherent-risk-ratings').pipe((
      map((res:any[])=>{
        ISMSDashboardStore.setIsmsInherentRating(res);
        return res;
      })
    ))
  }


   /**
   * @description
   * This method is used for getting isms residual risk rating.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */
    getIsmsResidualRiskRating(): Observable<IsmsResidualRiskRating[]> {
      return this._http.get<IsmsResidualRiskRating[]>('/dashboard/isms-risk-count-by-residual-risk-ratings').pipe((
        map((res:any[])=>{
          ISMSDashboardStore.setIsmsResidualRiskRating(res);
          return res;
        })
      ))
    }

   /**
   * @description
   * This method is used for getting isms risk source
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */
    getIsmsRiskSource(): Observable<IsmsRiskSource[]> {
      return this._http.get<IsmsRiskSource[]>('/dashboard/isms-risk-count-by-sources').pipe((
        map((res:any[])=>{
          ISMSDashboardStore.setIsmsRiskSource(res);
          return res;
        })
      ))
    }


   /**
   * @description
   * This method is used for getting isms risk dept.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
  getIsmsRiskDepartments(): Observable<IsmsRiskDepartments[]> {
    return this._http.get<IsmsRiskDepartments[]>('/dashboard/isms-risk-count-by-departments').pipe((
      map((res:IsmsRiskDepartments[])=>{
        ISMSDashboardStore.setIsmsRiskDepartments(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting isms risk sections
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */
  getIsmsRiskSections(): Observable<IsmsRiskSections[]> {
    return this._http.get<IsmsRiskSections[]>('/dashboard/isms-risk-count-by-sections').pipe((
      map((res:IsmsRiskSections[])=>{
        ISMSDashboardStore.setIsmsRiskSections(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting isms risk statuses
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
  getIsmsRiskStatuses(): Observable<IsmsRiskStatuses[]> {
    return this._http.get<IsmsRiskStatuses[]>('/dashboard/isms-risk-count-by-statuses').pipe((
      map((res:IsmsRiskStatuses[])=>{
        ISMSDashboardStore.setIsmsRiskStatuses(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting isms risk categories
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
  getIsmsRiskCategories(): Observable<IsmsRiskCategories[]> {
    return this._http.get<IsmsRiskCategories[]>('/dashboard/isms-risk-count-by-categories').pipe((
      map((res:IsmsRiskCategories[])=>{
        ISMSDashboardStore.setIsmsRiskCategories(res);
        return res;
      })
    ))
  }

 
   /**
   * @description
   * This method is used for getting isms risk owners
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
  getIsmsRiskOwners(): Observable<IsmsRiskOwners[]> {
    return this._http.get<IsmsRiskOwners[]>('/dashboard/isms-risk-count-by-owners').pipe((
      map((res:IsmsRiskOwners[])=>{
        ISMSDashboardStore.setIsmsRiskOwners(res);
        return res;
      })
    ))
  }

     /**
   * @description
   * This method is used for getting isms risk heat map.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
      getIsmsRiskHeatMap(): Observable<IsmsRiskHeatMap[]> {
        return this._http.get<IsmsRiskHeatMap[]>('/dashboard/isms-risk-heat-map').pipe((
          map((res:IsmsRiskHeatMap[])=>{
            ISMSDashboardStore.setIsmsRiskHeatMap(res);
            return res;
          })
        ))
      }

      
     /**
   * @description
   * This method is used for getting isms risk asset criticality
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
      getIsmsRiskAssetCriticality(): Observable<IsmsRiskAssetCriticality[]> {
        return this._http.get<IsmsRiskAssetCriticality[]>('/dashboard/isms-risk-count-by-asset-criticality-rating').pipe((
          map((res:IsmsRiskAssetCriticality[])=>{
            ISMSDashboardStore.setIsmsRiskAssetCriticality(res);
            return res;
          })
        ))
      }      

   /**
   * @description
   * This method is used for getting isms risk asset criticality
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
    getIsmsRiskTreatmentProgressCount(): Observable<IsmsRiskTreatmentProgressCount[]> {
        return this._http.get<IsmsRiskTreatmentProgressCount[]>('/dashboard/isms-risk-treatment-progress-counts').pipe((
            map((res:IsmsRiskTreatmentProgressCount[])=>{
                  ISMSDashboardStore.setIsmsRiskTreatmentProgressCount(res);
                  return res;
                })
              ))
            }      

   /**
   * @description
   * This method is used for getting isms risk asset criticality
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof IsmsDashboardService
   */  
    getIsmsRiskAgeningStatusCount(): Observable<IsmsRiskAgeningStatusCount[]> {
      return this._http.get<IsmsRiskAgeningStatusCount[]>('/dashboard/isms-risk-agening-status-counts').pipe((
          map((res: IsmsRiskAgeningStatusCount[])=>{
                ISMSDashboardStore.setIsmsRiskAgeningStatusCount(res);
                return res;
              })
            ))
          }      

}
