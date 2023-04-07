import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

import { SwotService } from "src/app/core/services/organization/context/swot-service/swot.service";
import { SwotStore } from "src/app/stores/organization/context/swot.store";

import { PestleService } from "src/app/core/services/organization/context/pestle-service/pestle.service";
import { PestleStore } from "src/app/stores/organization/context/pestle.store";

import { InternalissueService } from "src/app/core/services/organization/context/internal-issues-service/internalissue.service";
import { InternalIssueStore } from "src/app/stores/organization/context/internal-issue.store";

import { ExternalissueService } from "src/app/core/services/organization/context/external-issues-service/externalissue.service";
import { ExternalIssueStore } from "src/app/stores/organization/context/external-issue.store";

import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";

import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
})
export class ViewMoreComponent implements OnInit {

  @Input('details') viewMoreDetails: {type: null, title: string, page: string};
  
  SwotStore = SwotStore;
  PestleStore = PestleStore;
  InternalIssueStore = InternalIssueStore;
  ExternalIssueStore = ExternalIssueStore;
  IssueListStore = IssueListStore;
  AuthStore = AuthStore;

  constructor(private _eventEmitterService: EventEmitterService, private _swotService: SwotService,
    private _pestleService: PestleService, private _internalIssueService: InternalissueService,
    private _externalIssueService: ExternalissueService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  // Close Modal
  closeViewMoreModal(){
    this._eventEmitterService.dismissViewMorePopup();
  }

  /**
   * Get Next Page
   * @param page Page Number
   */
  pageChange(page){
    switch(this.viewMoreDetails.page){
      case 'swot':  SwotStore.setCurrentPageByItem(this.viewMoreDetails.title,page);
                    this._swotService.getItems(this.viewMoreDetails.title,this.viewMoreDetails.type).subscribe(res=>{
                      this._utilityService.detectChanges(this._cdr);
                    });
                    break;
      case 'pestle':  PestleStore.setCurrentPageByItem(this.viewMoreDetails.title,page);
                      this._pestleService.getItems(this.viewMoreDetails.title,this.viewMoreDetails.type).subscribe(res=>{
                        this._utilityService.detectChanges(this._cdr);
                      });
                      break;
      case 'internal_issue': InternalIssueStore.setCurrentPage(page);
                              this._internalIssueService.getItems(this.viewMoreDetails.type,this.viewMoreDetails.title).subscribe(res=>{
                                this._utilityService.detectChanges(this._cdr);
                              });
                              break;
      case 'external_issue': ExternalIssueStore.setCurrentPage(page);
                              this._externalIssueService.getItems(this.viewMoreDetails.type,this.viewMoreDetails.title).subscribe(res=>{
                                this._utilityService.detectChanges(this._cdr);
                              });
                              break;
    }
  }

  /**
   * Goto Issue Details
   * @param issueId Issue Id
   */
  gotoIssueDetails(issueId){
    this.closeViewMoreModal();
    IssueListStore.unsetIssueDetails();
    IssueListStore.setSelectedIssueId(issueId);
    this._router.navigateByUrl('/organization/issue-details/'+IssueListStore.selectedId)
  }

}
