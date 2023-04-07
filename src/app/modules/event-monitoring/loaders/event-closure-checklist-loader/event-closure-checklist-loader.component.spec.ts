import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureChecklistLoaderComponent } from './event-closure-checklist-loader.component';

describe('EventClosureChecklistLoaderComponent', () => {
  let component: EventClosureChecklistLoaderComponent;
  let fixture: ComponentFixture<EventClosureChecklistLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureChecklistLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureChecklistLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
