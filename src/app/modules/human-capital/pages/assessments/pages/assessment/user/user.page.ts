import { Component,ChangeDetectorRef,ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { UserIndividualService } from 'src/app/core/services/human-capital/assessment/user-individual/user-individual.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UserIndividualStore } from 'src/app/stores/human-capital/assessment/user-individual.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'human-capital-assessment-user-page',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss']
})
export class HumanCapitalAssessmentUser implements OnInit,OnDestroy {
    UserIndividualStore = UserIndividualStore;
    subMenuItems: { id: number, title: string }[];
    formErrors: any;
    AppStore = AppStore;
    SubMenuItemStore = SubMenuItemStore;
    reactionDisposer: IReactionDisposer;
    AuthStore = AuthStore;
    OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
    emptyMessage = "no_data_found";
    constructor(
        private _userIndividualService: UserIndividualService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _humanCapitalService:HumanCapitalService,
        private _imageService:ImageServiceService
       
    ) { }

    ngOnInit() {
        this.reactionDisposer = autorun(() => {
            if (SubMenuItemStore.clikedSubMenuItem) {

                switch (SubMenuItemStore.clikedSubMenuItem.type) {
                   
                    case "template":
                        // this._userIndividualService.generateTemplate();
                        break;
                    case "export_to_excel":
                        //  this._userIndividualService.exportToExcel();
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
        //     //{ type: 'close', path: 'human-capital' },
        // ]);
        // UserIndividualStore.excellent_status = 'Inactive';

        UserIndividualStore.setOrderBy(null);
        this._userIndividualService.getSummaryData().subscribe(res=>{
            this._utilityService.detectChanges(this._cdr);
            
        });
        this._userIndividualService.getExcellentUsers().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
               
        
        //  this.pageChange(1, 'excellent');
    }

    pageChange(newPage: number = null, type: string) {
        this.setStatus(type);

        switch (type) {
            case "excellent":
                if (UserIndividualStore.excellent_status == 'Active') {
                if (newPage) UserIndividualStore.setExcellentCurrentPage(newPage);
                this._userIndividualService.getExcellentUsers().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }

                break;

            case "good":
                if (UserIndividualStore.good_status == 'Active') {
                    if (newPage) UserIndividualStore.setGoodCurrentPage(newPage);
                    this._userIndividualService.getGoodUsers().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "average":
                if (UserIndividualStore.average_status == 'Active') {
                    if (newPage) UserIndividualStore.setAverageCurrentPage(newPage);
                    this._userIndividualService.getAverageUsers().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "below_average":
                if (UserIndividualStore.below_status == 'Active') {
                    if (newPage) UserIndividualStore.setBelowAverageCurrentPage(newPage);
                    this._userIndividualService.getBelowAverageUsers().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;
        }
        this._utilityService.detectChanges(this._cdr);
    }

    getNoDataSource(type){
        let noDataSource = {
          noData: this.emptyMessage, border: false, imageAlign: type
        }
        return noDataSource;
      }

    setStatus(type) {
        switch (type) {
            case "excellent":
                if (UserIndividualStore.excellent_status != 'Active'){
                    UserIndividualStore.excellent_status = 'Active';
                }
                    
                else{
                    UserIndividualStore.excellent_status = 'Inactive';
                }
                   
                break;

            case "good":
                if (UserIndividualStore.good_status != 'Active'){
                    UserIndividualStore.good_status = 'Active';
                }
                    
                else
                    UserIndividualStore.good_status = 'Inactive';
                break;
            case "average":
                if (UserIndividualStore.average_status != 'Active'){
                    UserIndividualStore.average_status = 'Active'; 
                }
                    
                else{
                    UserIndividualStore.average_status = 'Inactive';
                }
                    
                break;

            case "below_average":
                if (UserIndividualStore.below_status != 'Active'){
                    UserIndividualStore.below_status = 'Active'; 
                }
                    
                else
                    UserIndividualStore.below_status = 'Inactive';
                break;
        }
    }

    createImageUrl(token) {
        return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }

    getDefaultImage(){
        return this._imageService.getDefaultImageUrl('user-logo');
    }

 

    ngOnDestroy() {
        // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
        if (this.reactionDisposer) this.reactionDisposer();
        SubMenuItemStore.makeEmpty();
    }

}