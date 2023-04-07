import { computed, observable } from "mobx";

class Store {

    @observable
    message;

    @observable
    messageArrayData:any;

    setMessage(message){
        this.message = message;
         this.messageArrayData = {
            query:null,
            message:this.message.message,
        }
    }

    @computed
    get returnMessage() {
        return this.messageArrayData;
    }
}
export const ChatbotStore = new Store();