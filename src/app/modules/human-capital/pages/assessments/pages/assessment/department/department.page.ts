import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { DepartmentService } from 'src/app/core/services/human-capital/assessment/department/department.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DepartmentStore } from 'src/app/stores/human-capital/assessment/department.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'human-capital-assessment-department-page',
    templateUrl: './department.page.html',
    styleUrls: ['./department.page.scss']
})
export class HumanCapitalAssessmentDepartment implements OnInit,OnDestroy {

    DepartmentStore = DepartmentStore;
    subMenuItems: { id: number, title: string }[];
    AppStore = AppStore;
    emptyMessage="no_data_found"
    SubMenuItemStore = SubMenuItemStore;
    reactionDisposer: IReactionDisposer;
    AuthStore = AuthStore;
    constructor(
        private _departmentIndividualService: DepartmentService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.reactionDisposer = autorun(() => {
            if (SubMenuItemStore.clikedSubMenuItem) {

                switch (SubMenuItemStore.clikedSubMenuItem.type) {
                   
                    case "template":
                        // this._departmentIndividualService.generateTemplate();
                        break;
                    case "export_to_excel":
                        //  this._departmentIndividualService.exportToExcel();
                        break;
                    default:
                        break;
                }

                // Don't forget to unset clicked item immediately after using it
                SubMenuItemStore.unSetClickedSubMenuItem();
            }
            NoDataItemStore.setNoDataItems({title: "no_assessment_title"});
        })




        // SubMenuItemStore.setSubMenuItems([
        //     { type: 'template' },
        //     { type: 'export_to_excel' },

        // ]);

        this._departmentIndividualService.getDepartmentSummary().subscribe(res=>{
            this._utilityService.detectChanges(this._cdr);
        });
        
        this._departmentIndividualService.getExcellentDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                
    }

    getData(type: string) {
        this.setStatus(type);

        switch (type) {
            case "excellent":
                if(DepartmentStore.excellent_status == 'Active')
                this._departmentIndividualService.getExcellentDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                
                break;

            case "good":
                if (DepartmentStore.good_status == 'Active') {
                    this._departmentIndividualService.getGoodDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "average":
                if (DepartmentStore.average_status == 'Active') {
                    this._departmentIndividualService.getAverageDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "below_average":
                if (DepartmentStore.below_status == 'Active') {
                    this._departmentIndividualService.getBelowAverageDepartments().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;
        }
        this._utilityService.detectChanges(this._cdr);
    }

    setStatus(type) {
        switch (type) {
            case "excellent":
                if (DepartmentStore.excellent_status != 'Active')
                    DepartmentStore.excellent_status = 'Active';
                else
                    DepartmentStore.excellent_status = 'Inactive';
                break;

            case "good":
                if (DepartmentStore.good_status != 'Active')
                    DepartmentStore.good_status = 'Active';
                else
                    DepartmentStore.good_status = 'Inactive';
                break;
            case "average":
                if (DepartmentStore.average_status != 'Active')
                    DepartmentStore.average_status = 'Active';
                else
                    DepartmentStore.average_status = 'Inactive';
                break;

            case "below_average":
                if (DepartmentStore.below_status != 'Active')
                    DepartmentStore.below_status = 'Active';
                else
                    DepartmentStore.below_status = 'Inactive';
                break;
        }
    }

    getNoDataSource(type){
        let noDataSource = {
          noData: this.emptyMessage, border: false, imageAlign: type
        }
        return noDataSource;
      }

    ngOnDestroy() {
        // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
        if (this.reactionDisposer) this.reactionDisposer();
        SubMenuItemStore.makeEmpty();
        DepartmentStore.summary_loaded = false;
    }
}