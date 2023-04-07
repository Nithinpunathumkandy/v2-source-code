import { action, computed, observable } from "mobx-angular";
import { EventLessonLearnedPaginationResponse, EventLessonLearnedDetails , EventLessonLearned } from 'src/app/core/models/event-monitoring/events/event-lesson-learned';

class Store {
    @observable
    private _eventLessonLearned: EventLessonLearned[] = [];

    @observable
    private _eventLessonLearnedDetails:EventLessonLearnedDetails

    @observable  
    loaded:boolean=false;

    @observable
    currentPage: number = 1;
    
    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'lesson_learned.created_at';

    @observable
    individualLoaded: boolean = false;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    searchText: string;

    @observable
    selectedEventId: number = null;

    @observable
    LessonLearntId: number = null;

    @observable
    taskPhaseType:string="Initiation"

    @observable
    taskPhaseId:number=1

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    setEventLessonLearnedList(response:EventLessonLearnedPaginationResponse) {
        this._eventLessonLearned = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }
    
    @computed
    get eventLessonLearnedList():EventLessonLearned[]{
        return this._eventLessonLearned.slice();
    }

    @action
    unsetEventLessonLearnedList(){
        this._eventLessonLearned = [];
        //this.currentPage = 1;
        this.loaded = false;
    }

    @action
    setIndividualEventLessonLearnedDetails(details:EventLessonLearnedDetails){
        this.individualLoaded = true;
        this._eventLessonLearnedDetails = details;        
    }

    @action
    unsetIndividualEventLessonLearnedDetails() {
        this.individualLoaded = false;
        this._eventLessonLearnedDetails = null;
    }

    @computed
    get IndividualEventLessonLearnedDetails():EventLessonLearnedDetails {
        return this._eventLessonLearnedDetails;
    }

}

export const EventLessonLearnedStore = new Store();