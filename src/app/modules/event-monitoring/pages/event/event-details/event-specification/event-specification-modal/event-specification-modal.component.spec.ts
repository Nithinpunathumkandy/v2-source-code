import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSpecificationModalComponent } from './event-specification-modal.component';

describe('EventSpecificationModalComponent', () => {
  let component: EventSpecificationModalComponent;
  let fixture: ComponentFixture<EventSpecificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventSpecificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSpecificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
