import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { AppStore } from 'src/app/stores/app.store';
import { CommentStore } from 'src/app/stores/comment.store';
import { AuthStore } from "src/app/stores/auth.store";
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";

@Component({
  selector: 'app-child-clause',
  templateUrl: './child-clause.component.html',
  styleUrls: ['./child-clause.component.scss']
})
export class ChildClauseComponent implements OnInit {

  @Input('source') childData: any;
  @Input('type') type: any;
  @Input('index') index: any;
  clauseIndex = 0;
  bcpClauseObject = {
    type: null,
    values: null,
    version_id: null,
    order: null,
    business_continuity_plan_version_content_id: null,
    bcpType: null,
    index_no: null
  }
  BcpStore = BcpStore;
  AuthStore = AuthStore;
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
  }

  changeClauseIndex(index){
    if(this.clauseIndex == index) this.clauseIndex = null;
    else this.clauseIndex = index;
    this._utilityService.detectChanges(this._cdr);
  }


  newSubClause(id,item,index){
    this.bcpClauseObject.type = 'New';
    this.bcpClauseObject.values = id;
    this.bcpClauseObject.order = this.childData[0].children.length+1;
    this.bcpClauseObject.index_no = index.toString();
    // if(item.hasOwnProperty('business_continuity_plan_change_request_id')) {
    //   item['business_continuity_plan_change_request_type_id'] = item['business_continuity_plan_change_request_id']
    //   this.bcpClauseObject.bcpType = item;
    // }
    if(this.type){
      let bcpType = { 
        business_continuity_plan_change_request_id : item.business_continuity_plan_change_request_id,
        business_continuity_plan_change_request_content_id : id 
      };
      this.bcpClauseObject.bcpType = bcpType;
    }
    else this.bcpClauseObject.bcpType = null;
    this._eventEmitterService.bcpChildClauseChangeEvent(JSON.parse(JSON.stringify(this.bcpClauseObject)));
    this.clearBcpClauseObject();
  }

  deleteClauseConfirm(id,item){
    this.bcpClauseObject.type = 'Delete';
    this.bcpClauseObject.values = id;
    // if(item.hasOwnProperty('business_continuity_plan_change_request_id')){ 
    //   item['business_continuity_plan_change_request_type_id'] = item['business_continuity_plan_change_request_id']
    //   this.bcpClauseObject.bcpType = item;
    // }
    if(this.type){
      let bcpType = { 
        business_continuity_plan_change_request_id : item.business_continuity_plan_change_request_id,
        business_continuity_plan_change_request_content_id : item.business_continuity_plan_change_request_content_id
      };
      this.bcpClauseObject.bcpType = bcpType;
    }
    else this.bcpClauseObject.bcpType = null;
    this._eventEmitterService.bcpChildClauseChangeEvent(JSON.parse(JSON.stringify(this.bcpClauseObject)));
    this.clearBcpClauseObject();
  }

  getIndex(num){
    if(this.index) return this.index+'.'+num.toString()
    else return num;
  }

  editClause(clause){
    this.bcpClauseObject.type = 'Edit';
    this.bcpClauseObject.values = clause;
    // if(clause.hasOwnProperty('business_continuity_plan_change_request_id')) {
    //   clause['business_continuity_plan_change_request_type_id'] = clause['business_continuity_plan_change_request_id'];
    //   this.bcpClauseObject.bcpType = clause;
    // }
    if(this.type){
      let bcpType = { 
        business_continuity_plan_change_request_id : clause.business_continuity_plan_change_request_id,
        business_continuity_plan_change_request_content_id : clause.business_continuity_plan_change_request_content_id
      };
      this.bcpClauseObject.bcpType = bcpType;
    }
    else this.bcpClauseObject.bcpType = null;
    this._eventEmitterService.bcpChildClauseChangeEvent(JSON.parse(JSON.stringify(this.bcpClauseObject)));
    this.clearBcpClauseObject();
  }

  clearBcpClauseObject(){
    this.bcpClauseObject.bcpType = null;
    this.bcpClauseObject.business_continuity_plan_version_content_id = null;
    this.bcpClauseObject.order = null;
    this.bcpClauseObject.type = null;
    this.bcpClauseObject.values = null;
    this.bcpClauseObject.version_id = null;
  }

  openComment(id){
    CommentStore.unsetComments();
    AppStore.openCommentBox();
    CommentStore.commentApi = `/bcp-version-contents/${id}`;
    this._utilityService.detectChanges(this._cdr);
  }

}
