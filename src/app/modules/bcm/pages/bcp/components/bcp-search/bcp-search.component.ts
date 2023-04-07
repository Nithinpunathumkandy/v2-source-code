import { Component, OnInit , ChangeDetectorRef, Input } from '@angular/core';
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Component({
  selector: 'app-bcp-search',
  templateUrl: './bcp-search.component.html',
  styleUrls: ['./bcp-search.component.scss']
})
export class BcpSearchComponent implements OnInit {
  @Input('type') type: string;
  BcpStore = BcpStore;
  searchText: string;
  clauseIndex: number = null;
  emptyMessage: string = 'no_data_found';
  constructor(private _bcpService: BcpService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService) { }

  ngOnInit(): void {
    this.clauseIndex = 0;
  }

  cancel(){
    this.searchText = null;
    BcpStore.bcpSearchItem = [];
    this._eventEmitterService.dismissSearchModal();
  }

  searchBcp(){
    if(this.searchText){
      this._bcpService.searchBcpContents(this.searchText,this.type).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    } 
  }

  changeClauseIndex(index){
    if(this.clauseIndex == index) this.clauseIndex = null;
    else this.clauseIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }

  convertHighlight(title,arg){
    return this._helperService.highLighText(title,arg);
  }

}
