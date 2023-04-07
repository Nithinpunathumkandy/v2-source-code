import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActionPlans,ActionPlansResponse, HistoryResponse} from "src/app/core/models/mrm/action-plans/action-plans";
import { UtilityService } from "src/app/shared/services/utility.service";
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";
import { ActionPlansStore } from "src/app/stores/mrm/action-plans/action-plans-store";
import { HelperServiceService } from "../../general/helper-service/helper-service.service";

@Injectable({
  providedIn: "root",
})
export class ActionPlansService {

  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) {}

  getItems(
    getAll: boolean = false,
    additionalParams?: string
  ): Observable<ActionPlansResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${ActionPlansStore.currentPage}&status=all`;
      if (ActionPlansStore.orderBy)
        params += `&order_by=${ActionPlansStore.orderItem}&order=${ActionPlansStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if (ActionPlansStore.searchText)
      params += (params ? "&q=" : "?q=") + ActionPlansStore.searchText;
    if (
      RightSidebarLayoutStore.filterPageTag == "action_plan" &&
      RightSidebarLayoutStore.filtersAsQueryString
    )
      params =
        params == ""
          ? "?" + RightSidebarLayoutStore.filtersAsQueryString
          : params + "&" + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http
      .get<ActionPlansResponse>(
        "/meeting-action-plans" + (params ? params : "")
      )
      .pipe(
        map((res: ActionPlansResponse) => {
          ActionPlansStore.setActionPlans(res);
          return res;
        })
      );
  }

  getItem(id: number): Observable<ActionPlans> {
    return this._http.get<ActionPlans>("/meeting-action-plans/" + id).pipe(
      map((res: ActionPlans) => {
        ActionPlansStore.setIndividualActionPlansDetails(res);
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post("/meeting-action-plans", data).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_is_added"
        );
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  
  closeItem(id) {
    return this._http.put("/meeting-action-plans/"+ id +'/close',null).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_is_added"
        );
        return res;
      })
    );
  }

  updateItem(actionPlan_id: number, data: ActionPlans): Observable<any> {
    return this._http.put("/meeting-action-plans/" + actionPlan_id, data).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_has_been_updated"
        );
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number,MeetingPlanIdORmeetingIdparms?) {
    return this._http.delete("/meeting-action-plans/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_has_been_deleted"
        );
        this.getItems(false, MeetingPlanIdORmeetingIdparms? MeetingPlanIdORmeetingIdparms : null).subscribe((resp) => {
          if (resp.from == null) {
            ActionPlansStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, MeetingPlanIdORmeetingIdparms? MeetingPlanIdORmeetingIdparms : null).subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http
      .get("/meeting-action-plans/template", { responseType: "blob" as "json" })
      .subscribe((response: any) => {
        this._utilityService.downloadFile(response, "Action Plan Template.xlsx");
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_action_plan_template')+".xlsx");
      });
  }

  exportToExcel() {
    let params = '';
    if (ActionPlansStore.orderBy) params += `?order=${ActionPlansStore.orderBy}`;
    if (ActionPlansStore.orderItem) params += `&order_by=${ActionPlansStore.orderItem}`;
    // if (ActionPlansStore.searchText) params += `&q=${ActionPlansStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'action_plan' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http
      .get("/meeting-action-plans/export"+params, { responseType: "blob" as "json" })
      .subscribe((response: any) => {
        this._utilityService.downloadFile(response, "Action Plan.xlsx");
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_action_plan')+".xlsx");
      });
  }


  
  setSelected(position?: number, process: boolean = false, reload = false) {
    if (process) {
      var items: ActionPlans[] = ActionPlansStore.allItems;
      if (position >= 0) {
        if (items.length > 0) {
          if (position == 0) {
            if (reload)
              this.itemChange.emit(items[0].id);
            ActionPlansStore.setSelected(items[0].id)
          }
          else {
            if (items.length >= 1) {
              if (reload)
                this.itemChange.emit(items[position - 1].id);
              ActionPlansStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else {
        if (items.length > 0) {
          if (reload)
            this.itemChange.emit(items[0].id);
          ActionPlansStore.setSelected(items[0].id);
        }
      }
    }
    else {
      if (position) {
        if (reload)
          this.itemChange.emit(position);
        ActionPlansStore.setSelected(position)
      }
      else {
        if (reload)
          this.itemChange.emit(ActionPlansStore.initialItemId);
        ActionPlansStore.setSelected(ActionPlansStore.initialItemId);
      }
    }
  }


  setDocumentDetails(imageDetails, url) {
    ActionPlansStore.setDocumentDetails(imageDetails, url);
  }

  sortActionPlansList(type: string, text: string) {
    if (!ActionPlansStore.orderBy) {
      ActionPlansStore.orderBy = "desc";
      ActionPlansStore.orderItem = type;
    } else {
      if (ActionPlansStore.orderItem == type) {
        if (ActionPlansStore.orderBy == "desc")
          ActionPlansStore.orderBy = "asc";
        else ActionPlansStore.orderBy = "desc";
      } else {
        ActionPlansStore.orderBy = "desc";
        ActionPlansStore.orderItem = type;
      }
    }
  }

  updateProgressItem(actionplanId: number, data): Observable<any> {
    return this._http
      .post("/meeting-action-plans/" + actionplanId + "/updates", data)
      .pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "action_plan_status_updated"
          );
          this.getItem(actionplanId).subscribe();
          return res;
        })
      );
  }

  getHistory(actionplanId: number): Observable<HistoryResponse> {
    let params = '';
    params = `?page=${ActionPlansStore.currentPage}`;
    if (ActionPlansStore.orderBy) params += `&order_by=${ActionPlansStore.historyOrderItem}&order=${ActionPlansStore.historyOrderBy}`;

    return this._http.get<HistoryResponse>("/meeting-action-plans/" + actionplanId + "/updates" + (params ? params : '')).pipe(
      map((res: HistoryResponse) => {
        ActionPlansStore.setActionPlanHistory(res);
        return res;
      })
    );
  }
}
