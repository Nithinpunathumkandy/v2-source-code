import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDetailsPopupComponent } from './calendar-details-popup.component';

describe('CalendarDetailsPopupComponent', () => {
  let component: CalendarDetailsPopupComponent;
  let fixture: ComponentFixture<CalendarDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarDetailsPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
