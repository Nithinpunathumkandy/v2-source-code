import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileObjectiveLoaderComponent } from './event-profile-objective-loader.component';

describe('EventProfileObjectiveLoaderComponent', () => {
  let component: EventProfileObjectiveLoaderComponent;
  let fixture: ComponentFixture<EventProfileObjectiveLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileObjectiveLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileObjectiveLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
