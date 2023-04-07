import { Component, ChangeDetectionStrategy, OnInit} from '@angular/core';

declare var $: any;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-human-capital-assessments-page',
    templateUrl: './human-capital-assessments.page.html',
    styleUrls: ['./human-capital-assessments.page.scss']
})
export class HumanCapitalAssessmentsPage implements OnInit {

    constructor(
       
    ) { }

    ngOnInit() {
   
    }

   
  
}
