import { Component, ChangeDetectorRef,ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { TeamService } from 'src/app/core/services/human-capital/assessment/team/team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { TeamStore } from 'src/app/stores/human-capital/assessment/team.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'human-capital-assessment-team-page',
    templateUrl: './team.page.html',
    styleUrls: ['./team.page.scss']
})
export class HumanCapitalAssessmentTeam implements OnInit,OnDestroy{
    TeamStore = TeamStore;
    subMenuItems: { id: number, title: string }[];
    formErrors: any;
    AppStore = AppStore;
    emptyMessage="no_data_found"
    SubMenuItemStore = SubMenuItemStore;
    reactionDisposer: IReactionDisposer;
    AuthStore = AuthStore;
    constructor(
        private _teamIndividualService: TeamService,
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.reactionDisposer = autorun(() => {
            if (SubMenuItemStore.clikedSubMenuItem) {

                switch (SubMenuItemStore.clikedSubMenuItem.type) {
                   
                    case "template":
                        // this._teamIndividualService.generateTemplate();
                        break;
                    case "export_to_excel":
                        //  this._teamIndividualService.exportToExcel();
                        break;
                    default:
                        break;
                }

                // Don't forget to unset clicked item immediately after using it
                SubMenuItemStore.unSetClickedSubMenuItem();
            }
        })




        // SubMenuItemStore.setSubMenuItems([
        //     // { type: 'new_modal' },
        //     { type: 'template' },
        //     { type: 'export_to_excel' },
        //     //{ type: 'close', path: 'human-capital' },
        // ]);

        this._teamIndividualService.getTeamSummary().subscribe();
        
        this.getData('excellent');
    }

    getData(type: string) {
        this.setStatus(type);

        switch (type) {
            case "excellent":

                this._teamIndividualService.getExcellentTeams().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

                break;

            case "good":
                if (TeamStore.good_status == 'Active') {
                    this._teamIndividualService.getGoodTeams().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "average":
                if (TeamStore.average_status == 'Active') {
                    this._teamIndividualService.getAverageTeams().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;

            case "below_average":
                if (TeamStore.below_status == 'Active') {
                    this._teamIndividualService.getBelowAverageTeams().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
                }
                break;
        }
        this._utilityService.detectChanges(this._cdr);
    }

    setStatus(type) {
        switch (type) {
            case "excellent":
                if (TeamStore.excellent_status != 'Active')
                    TeamStore.excellent_status = 'Active';
                else
                    TeamStore.excellent_status = 'Inactive';
                break;

            case "good":
                if (TeamStore.good_status != 'Active')
                    TeamStore.good_status = 'Active';
                else
                    TeamStore.good_status = 'Inactive';
                break;
            case "average":
                if (TeamStore.average_status != 'Active')
                    TeamStore.average_status = 'Active';
                else
                    TeamStore.average_status = 'Inactive';
                break;

            case "below_average":
                if (TeamStore.below_status != 'Active')
                    TeamStore.below_status = 'Active';
                else
                    TeamStore.below_status = 'Inactive';
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