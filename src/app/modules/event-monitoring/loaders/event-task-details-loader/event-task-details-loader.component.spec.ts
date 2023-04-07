import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTaskDetailsLoaderComponent } from './event-task-details-loader.component';

describe('EventTaskDetailsLoaderComponent', () => {
  let component: EventTaskDetailsLoaderComponent;
  let fixture: ComponentFixture<EventTaskDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTaskDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTaskDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
