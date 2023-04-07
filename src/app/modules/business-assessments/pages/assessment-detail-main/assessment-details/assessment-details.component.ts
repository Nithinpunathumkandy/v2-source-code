import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
declare var $: any;

@Component({
  selector: 'app-assessment-details',
  templateUrl: './assessment-details.component.html',
  styleUrls: ['./assessment-details.component.scss']
})
export class AssessmentDetailsComponent implements OnInit {
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  AssessmentsStore=AssessmentsStore;
  AppStore=AppStore;

  constructor(
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {


    window.addEventListener('scroll', this.scrollEvent, true)
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id'];
      this.AssessmentsStore.setAssessmentId(id);         
    });

  }

  ngDoCheck(){
    document.body.style.overflow ="unset"
  }

  

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navigationBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navigationBar.nativeElement,'affix');

      }
    }
  }

  ngOnDestroy(){
    document.body.style.overflow ="hidden"
  }

}
