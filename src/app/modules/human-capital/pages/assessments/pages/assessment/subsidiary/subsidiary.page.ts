import { Component, ChangeDetectorRef,ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { SubsidiaryService } from 'src/app/core/services/human-capital/assessment/subsidiary/subsidiary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubsidiaryStore } from 'src/app/stores/human-capital/assessment/subsidiary.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'human-capital-assessment-subsidiary-page',
    templateUrl: './subsidiary.page.html',
    styleUrls: ['./subsidiary.page.scss']
})
export class HumanCapitalAssessmentSubsidiary implements OnInit, OnDestroy{
    SubsidiaryStore = SubsidiaryStore;
    subMenuItems: { id: number, title: string }[];
    formErrors: any;
    AppStore = AppStore;
    SubMenuItemStore = SubMenuItemStore;
    reactionDisposer: IReactionDisposer;
    AuthStore = AuthStore;
    emptyMessage="no_data_found"
    constructor(
        private _subsidiaryIndividualService: SubsidiaryService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.reactionDisposer = autorun(() => {
            if (SubMenuItemStore.clikedSubMenuItem) {

                switch (SubMenuItemStore.clikedSubMenuItem.type) {
                   
                    case "template":
                        // this._subsidiaryIndividualService.generateTemplate();
                        break;
                    case "export_to_excel":
                        //  this._subsidiaryIndividualService.exportToExcel();
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
        //     // { type: 'new_modal' },
        //     { type: 'template' },
        //     { type: 'export_to_excel' },
        //     //{ type: 'close', path: 'human-capital' },
        // ]);

        this._subsidiaryIndividualService.getSubsidiarySummary().subscribe(res=>{
            this._utilityService.detectChanges(this._cdr);
        });
        
        this._subsidiaryIndividualService.getExcellentSubsidiaries().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

    }

    getData(type: string) {
        this.setStatus(type);

        switch (type) {
            case "excellent":
                if (SubsidiaryStore.excellent_status == 'Active') 
                this._subsidiaryIndividualService.getExcellentSubsidiaries().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

                break;

            case "good":
                if (SubsidiaryStore.good_status == 'Active') {
                    this._subsidiaryIndividualService.getGoodSubsidiaries().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "average":
                if (SubsidiaryStore.average_status == 'Active') {
                    this._subsidiaryIndividualService.getAverageSubsidiaries().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "below_average":
                if (SubsidiaryStore.below_status == 'Active') {
                    this._subsidiaryIndividualService.getBelowAverageSubsidiaries().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;
        }
        this._utilityService.detectChanges(this._cdr);
    }

    setStatus(type) {
        switch (type) {
            case "excellent":
                if (SubsidiaryStore.excellent_status != 'Active')
                    SubsidiaryStore.excellent_status = 'Active';
                else
                    SubsidiaryStore.excellent_status = 'Inactive';
                break;

            case "good":
                if (SubsidiaryStore.good_status != 'Active')
                    SubsidiaryStore.good_status = 'Active';
                else
                    SubsidiaryStore.good_status = 'Inactive';
                break;
            case "average":
                if (SubsidiaryStore.average_status != 'Active')
                    SubsidiaryStore.average_status = 'Active';
                else
                    SubsidiaryStore.average_status = 'Inactive';
                break;

            case "below_average":
                if (SubsidiaryStore.below_status != 'Active')
                    SubsidiaryStore.below_status = 'Active';
                else
                    SubsidiaryStore.below_status = 'Inactive';
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
    }


}