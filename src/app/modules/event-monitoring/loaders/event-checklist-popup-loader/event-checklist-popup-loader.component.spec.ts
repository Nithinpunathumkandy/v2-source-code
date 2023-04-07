import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChecklistPopupLoaderComponent } from './event-checklist-popup-loader.component';

describe('EventChecklistPopupLoaderComponent', () => {
  let component: EventChecklistPopupLoaderComponent;
  let fixture: ComponentFixture<EventChecklistPopupLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChecklistPopupLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChecklistPopupLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
