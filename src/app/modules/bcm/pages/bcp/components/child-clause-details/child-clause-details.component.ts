import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from "src/app/stores/auth.store";
import { CommentStore } from 'src/app/stores/comment.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";

@Component({
  selector: 'app-child-clause-details',
  templateUrl: './child-clause-details.component.html',
  styleUrls: ['./child-clause-details.component.scss']
})
export class ChildClauseDetailsComponent implements OnInit {

  @Input('source') childData: any;
  @Input('type') type: any;
  @Input('index') index: any;
  @Input('buttons') buttons: any;
  AuthStore = AuthStore;
  BcpStore = BcpStore;
  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  openComment(contentId: number){
    CommentStore.unsetComments();
    AppStore.openCommentBox();
    CommentStore.commentApi = `/bcp-version-contents/${contentId}`;
    this._utilityService.detectChanges(this._cdr);
  }

  getIndex(num){
    if(this.index) return this.index+'.'+num.toString()
    else return num;
  }

}
