import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OrganizationModuleGroup,ModuleGroupsResponse, Labels } from 'src/app/core/models/settings/organization-modules';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

@Injectable({
  providedIn: 'root'
})
export class OrganizationModulesService {

  OrganizationModulesStore = OrganizationModulesStore;
  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getAllItems(params?:string): Observable<OrganizationModuleGroup[]> {
    return this._http.get<OrganizationModuleGroup[]>('/module-settings' + (params ? params : '')).pipe(
      map((res: OrganizationModuleGroup[]) => {
        for(let i of res){
          i.isEnabled = i.active == 1 ? true : false;
          for(let j of i.modules){
            j.isEnabled = j.active == 1 ? true : false;
          }
        }
        this.OrganizationModulesStore.setOrganizationModules(res);
        return res;
      })
    );
  }

  getModulesSettings(params?:string): Observable<OrganizationModuleGroup[]> {
    return this._http.get<OrganizationModuleGroup[]>('/module-settings' + (params ? params : '')).pipe(
      map((res: OrganizationModuleGroup[]) => {
        for(let i of res){
          i.isEnabled = i.active == 1 ? true : false;
          for(let j of i.modules){
            j.isEnabled = j.active == 1 ? true : false;
          }
          i.modules.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
        }
        this.OrganizationModulesStore.setOrganizationModulesSettings(res);
        return res;
      })
    );
  }

  activateModuleGroup(id: number){
    return this._http.put('/module-settings/module-group/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','module_group_activated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      })
    );
  }

  deactivateModuleGroup(id: number){
    return this._http.put('/module-settings/module-group/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','module_group_deactivated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      })
    );
  }

  activateModule(id: number){
    return this._http.put('/module-settings/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','module_activated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      })
    );
  }

  deactivateModule(id: number){
    return this._http.put('/module-settings/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','module_deactivated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      })
    );
  }

  // * To Get Module Items Based on Module Group Id

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        this.OrganizationModulesStore.setModuleGroups(res)
        return res;
      })
    );
  }

  updateModuleGroupOrder(items){
    return this._http.put('/module-settings/module-groups/reorder', items).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','order_updated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      })
    );
  }

  updateModuleOrder(items,module_id:number){
    return this._http.put('/module-settings/module-groups/'+module_id+'/module-reorder', items).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','order_updated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for updating module group rename
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof OrganizationModulesService
   */
        updateModuleGroup(id: number, item):Observable<any>{
          return this._http.put(`/module-settings/module-groups/${id}/rename`, item).pipe(map(res=>{
            this._utilityService.showSuccessMessage('success','module_group_updated');
            return res;
          }))
        }

   /**
   * @description
   * this method is used for updating module submenu rename
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof OrganizationModulesService
   */
    updateModuleSubmenu(id: number, item):Observable<any>{
      return this._http.put(`/module-settings/modules/${id}/rename`, item).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success','module_submenu_updated');
        return res;
      }))
    }

   /**
   * @description
   * This method is used for getting module menu title languages.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationModulesService
   */
    getModuleLanguages(id): Observable<Labels> {
      return this._http.get<Labels>('/module-groups/' + id).pipe(
        map((res: Labels) => {
          OrganizationModulesStore.setModuleLaguageLabelDetails(res)
          return res;
        })
      );
    }

   /**
   * @description
   * This method is used for getting sub menu title languages.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationModulesService
   */
    getSubModuleLanguages(id): Observable<Labels> {
      return this._http.get<Labels>('/modules/' + id).pipe(
        map((res: Labels) => {
          OrganizationModulesStore.setSubModuleLaguageLabelDetails(res)
          return res;
        })
      );
    }

   /**
   * @description
   * this method is used for updating star menu
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof OrganizationModulesService
   */
    updateStarMenu(items):Observable<any>{
      return this._http.put(`/module-settings/star-menu`, items).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success','star_menu_updated');
        this.getAllItems('?side_menu=true').subscribe();
        this.getModulesSettings().subscribe();
        return res;
      }))
    }    

}
