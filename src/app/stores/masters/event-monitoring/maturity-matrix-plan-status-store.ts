import { action, computed, observable } from "mobx";
import { MaturityMatrixPlanStatus, MaturityMatrixPlanStatusPaginationResponse } from "src/app/core/models/masters/event-monitoring/maturity-matrix-plan-status";

class store{
    @observable
    private _maturityMatrixPlanStatus: MaturityMatrixPlanStatus[]=[];

    @observable
    loaded:boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage : number = null;

    @observable
    totalItems: number = null;

    @observable
    from : number = null;

    @observable
    orderItem: string = 'event_maturity_matrix_plan_statuses.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedMaturityMatrixPlanStatus: number = null;

    searchText:string;

    @action
    setMaturityMatrixPlanStatus(response:MaturityMatrixPlanStatusPaginationResponse){
        this._maturityMatrixPlanStatus=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from=response.from;
        this.loaded=true;
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
   }

   @action
   setOrderBy(order_by: 'asc' | 'desc'){
       this.orderBy = order_by;
   }

   @action
   updateEventType(MaturityMatrixPlanStatus: MaturityMatrixPlanStatus) {
    const maturityMatrixPlanStatus: MaturityMatrixPlanStatus[] = this._maturityMatrixPlanStatus.slice();
    const index: number = maturityMatrixPlanStatus.findIndex(e => e.id == MaturityMatrixPlanStatus.id);
    if (index != -1) {
        MaturityMatrixPlanStatus[index] = MaturityMatrixPlanStatus;
        this._maturityMatrixPlanStatus = maturityMatrixPlanStatus;
        }
    }

    @action
    setMaturityMatrixPlanStatusById(id: number): MaturityMatrixPlanStatus{
        return this._maturityMatrixPlanStatus.slice().find(e=> e.id == id)
    }

    @action
    setLastInsertedMaturityMatrixPlanStatus(maturityMatrixPlanStatusId: number){
        this.lastInsertedMaturityMatrixPlanStatus =maturityMatrixPlanStatusId;
    }

    @computed
    get maturityMatrixPlanStatus(): MaturityMatrixPlanStatus[]{
        return this._maturityMatrixPlanStatus.slice();
    }
    
    get lastInsertedmaturityMatrixPlanStatus():number{
        if(this.lastInsertedMaturityMatrixPlanStatus)
            return this.lastInsertedMaturityMatrixPlanStatus;
        else
            return null;    
    }

}
export const MaturityMatrixPlanStatusMasterStore = new store();