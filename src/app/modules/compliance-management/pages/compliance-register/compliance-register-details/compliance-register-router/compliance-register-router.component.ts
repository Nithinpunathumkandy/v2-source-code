import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { ComplianceRegisterStore } from 'src/app/stores/compliance-management/compliance-register/compliance-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { DiscussionBotStore } from 'src/app/stores/general/discussion-bot.store';

@Component({
  selector: 'app-compliance-register-router',
  templateUrl: './compliance-register-router.component.html',
  styleUrls: ['./compliance-register-router.component.scss']
})
export class ComplianceRegisterRouterComponent implements OnInit , OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _renderer2:Renderer2,
  ) { }

  ComplianceRegisterStore=ComplianceRegisterStore;
  AppStore = AppStore;

  ngOnInit(): void {
    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      ComplianceRegisterStore.complianceRegisterId = id;
      
    //  this.getWorkflowDetails()
    });
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AppStore.showDiscussion = false;
  }

}
