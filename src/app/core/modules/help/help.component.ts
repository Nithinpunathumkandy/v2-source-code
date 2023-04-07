import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import{ FaqMasterStore } from 'src/app/stores/masters/general/faq-store';
import { FaqService } from 'src/app/core/services/masters/general/faq/faq.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  FaqMasterStore = FaqMasterStore;
  isNotDisplay:boolean=true;
  activateNumber:number;
  searchTerm: string;
  

  constructor( private _utilityService: UtilityService,
    private _faqService: FaqService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    
  }

  searchKey(val)
  {
   if(val=="")
   {
    this.isNotDisplay=true;
   }
   else{
    this.isNotDisplay=false;
    this._faqService.getAllSearchedItems(val).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
   }
    
  }
  activateClass(num)
  {
    if(this.activateNumber == num)
      this.activateNumber = null;
    else
      this.activateNumber = num;
  }
  clearSearchBar()
  {
    this.searchTerm="";
    this.searchKey("");
  }
  convertHighlight(title,arg)
  {
   
    return this._helperService.highLighText(title,arg);
  }

}
