import { Component, OnDestroy, OnInit,ElementRef,ViewChild,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

@Component({
  selector: 'app-control-assessment-details',
  templateUrl: './control-assessment-details.component.html',
  styleUrls: ['./control-assessment-details.component.scss']
})
export class ControlAssessmentDetailsComponent implements OnInit,OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  AppStore=AppStore;
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  ControlAssessmentStore=ControlAssessmentStore;
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  constructor(private _router: Router,private _renderer2: Renderer2) { }

  ngOnInit(): void {
    if(!ControlAssessmentStore.docversionId)
    {
      this._router.navigateByUrl('/business-assessments/control-assessments');
    }
    
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"control_assessment",
        path:`/business-assessments/control-assessment`
      });
    }

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
  ngOnDestroy(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    BreadCrumbMenuItemStore.refreshBreadCrumbMenu = false;
    ControlAssessmentDetailsStore.unSetControlAssessmentId();
  }

}
