import { observable, action, computed } from "mobx-angular";
import { Users } from "src/app/core/models/human-capital/users/users";

class Store {

    @observable
    private shareTitle: string;

    selectedUsers:Users[] = [];
    
    selectedEmails = '';

    description = '';

    formErrors: any = {};

    emaiErrors = [];

    @observable
    shareData:any = null;

    get title():string{
        return this.shareTitle;
    }

    @action
    setTitle(title:string){
        this.shareTitle = title;
    }

    @action
    setShareData(data){
        this.shareData = data;
    }

    @action
    unsetShareData(){
        this.shareData = null;
    }

    @action
    unsetData(){
        this.selectedUsers = [];
        this.selectedEmails = '';
        this.description = '';
    }

    @action
    processFormErrors(errors){
        let emailsArray = this.selectedEmails.split(',')
        for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
                if(key.startsWith('emails.')){
                    let keyValueSplit = key.split('.');
                    let errorPosition = parseInt(keyValueSplit[1]);
                    // let errorMessage = (errorPosition + 1) +'.'+ errors[key].toString().replace('.'+keyValueSplit[1],' ');
                    let errorMessage = (errorPosition + 1) +'. '+emailsArray[errorPosition]+' - '+errors[key].toString().replace('.'+keyValueSplit[1],' ');
                    this.emaiErrors.push(errorMessage);
                }
                if(key.startsWith('description')){
                    this.formErrors['description'] = errors[key];
                }
            }
        }
    }
   
}

export const ShareItemStore = new Store();