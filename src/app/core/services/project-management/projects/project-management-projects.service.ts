import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementProjectsService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<any> {
    ProjectsStore.is_loading = true;
    let params = '';
    if (!getAll) {
      // params = params+`&page=${RisksStore.currentPage}`;
      params = (params == '') ? params + `?page=${ProjectsStore.currentPage}` : params + `&page=${ProjectsStore.currentPage}`;
      if (ProjectsStore.orderBy) params += `&order=${ProjectsStore.orderBy}`;
      if (ProjectsStore.orderItem) params += `&order_by=${ProjectsStore.orderItem}`;
      if (ProjectsStore.searchText) params += `&q=${ProjectsStore.searchText}`;
      // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/projects' + (params ? params : '')).pipe(
      map((res: any) => {
        ProjectsStore.setProjectDetails(res);
        ProjectsStore.is_loading = false;
        ProjectsStore.currentSubProjectIndex = null;
        return res;
      })
    );
  }

  getItem(id) {
    let params = new HttpParams();
    params = params.set('master_project', id)
    return this._http.get('/projects', { params: params }).pipe((
      map((res: any) => {
        ProjectsStore._projectList.find(x => x?.id == id)['projects'] = res;
        return res;
      })
    ))
  }

  geSingletItem(id) {

    return this._http.get('/projects/' + id).pipe((
      map((res: any) => {
        return res;
      })
    ))
  }

  getSubProjects(id) {
    let params = new HttpParams();
    params = params.set('master_project', id)
    return this._http.get('/projects', { params: params }).pipe((
      map((res: any) => {
        res['id'] = id;
        res['items'] = res;
        return res;
      })
    ))
  }

  getPinnedProjects(page?) {
    let params = new HttpParams();
    if (page) params = params.set('page', page);
    return this._http.get('/projects?is_pinned=1', { params: params }).pipe(
      map((projects: any) => {
        ProjectsStore.setPinnedProjects(projects);
        return projects
      }),
      mergeMap(
        (projects: any) =>
          from(projects?.data).pipe(
            mergeMap(
              (sub_project: any) => {
                if (sub_project?.sub_project_count > 0) { return this.getSubProjects(sub_project?.id) }
                else return of(null);
              }
            ),
            map(res => {
              if (res) {
                ProjectsStore.pinnedProjects.data.find(x => x?.id == res?.id)['projects'] = res?.items;
              }
              return res
            })
          )
      )
    )
  }

  // map((res: any) => {
  //   ProjectsStore.setPinnedProjects(res);
  //   return res;
  // }),
  // (el: any) => el?.data?.forEach(item => {
  //   if (item?.sub_project_count > 0) {
  //     this.getSubProjects(item?.id).subscribe(el => {
  //       ProjectsStore.pinnedProjects.data.find(x => x?.id == item?.id)['projects'] = el;
  //     });
  //   }
  // })



  togglePinnedProject(id, type: 'pin' | 'unpin') {
    return this._http.put(`/projects/${id}/${type}`, '').pipe(
      map((res: any) => {
        // this.getPinnedProjects().subscribe();
        // this.getItems().subscribe();
        return res;
      }))
  }

  saveItem(item) {
    return this._http.post('/projects', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'project_created_successfully');
        return res;
      })
    );
  }

  updateItem(id, item) {
    return this._http.put(`/projects/${id}`, item).pipe(map((res: any) => {
      this._utilityService.showSuccessMessage('success', 'project_updated_successfully');
      return res;
    }))
  }


  delete(id: number) {
    return this._http.delete('/projects/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_deleted_successfully');
        this.getItems().subscribe(resp => {
          if (resp.from == null) {
            ProjectsStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });
        return res;
      })
    );
  }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'project-management-list': return environment.apiBasePath + '/project-management/files/project-logo/thumbnail?token=' + token + '&h=150&w=200';
        break;
      case 'project-management-document': return environment.apiBasePath + 'project-management/files/project-document/thumbnail?token=' + token + '&h=150&w=200';
        break;
      default:
        break;
    }
  }

  setDocumentDetails(imageDetails, url) {
    ProjectsStore.setDocumentImageDetails(imageDetails, url);
  }

  selectRequiredProjectManagement(issues) {
    ProjectsStore.addSelectedProjectManagement(issues);
  }

  exportToExcel(params) {
    this._http.get('/project-time-trackers/export?' + params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_time_tracker') + ".xlsx");
      }
    )
  }

}
