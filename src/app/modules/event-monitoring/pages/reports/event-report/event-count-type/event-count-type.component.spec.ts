import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCountTypeComponent } from './event-count-type.component';

describe('EventCountTypeComponent', () => {
  let component: EventCountTypeComponent;
  let fixture: ComponentFixture<EventCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
