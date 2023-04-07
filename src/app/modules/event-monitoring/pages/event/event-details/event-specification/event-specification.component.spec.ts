import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSpecificationComponent } from './event-specification.component';

describe('EventSpecificationComponent', () => {
  let component: EventSpecificationComponent;
  let fixture: ComponentFixture<EventSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventSpecificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
