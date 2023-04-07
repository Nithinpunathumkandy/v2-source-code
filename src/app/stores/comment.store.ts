import { observable, action } from 'mobx-angular';
import { comments } from '../core/models/comment.model';

class Store {
    
    @observable
    commentApi: string;

    @observable
    module:string;

    @observable
    commentGetApi:string;

    @observable
    comments: comments[] = [];

    @observable
    commentsLoaded: boolean = false;

    @observable
    commentObjectVariable: string = '';

    setComments(comments: comments[]){
        this.comments = comments;
        this.commentsLoaded = true;
    }

    unsetComments(){
        this.commentApi = '';
        this.module='';
        this.commentGetApi='';
        this.comments = [];
        this.commentsLoaded = false;
    }

    @action
    setCommentObjectVariable(variable: string){
        this.commentObjectVariable = variable;
    }

    get commentVariable(): string{
        return this.commentObjectVariable;
    }

}

export const CommentStore = new Store();