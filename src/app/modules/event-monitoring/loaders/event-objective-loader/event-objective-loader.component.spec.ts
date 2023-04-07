import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventObjectiveLoaderComponent } from './event-objective-loader.component';

describe('EventObjectiveLoaderComponent', () => {
  let component: EventObjectiveLoaderComponent;
  let fixture: ComponentFixture<EventObjectiveLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventObjectiveLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventObjectiveLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
