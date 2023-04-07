import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventDateChangeRequestComponent } from './edit-event-date-change-request.component';

describe('EditEventDateChangeRequestComponent', () => {
  let component: EditEventDateChangeRequestComponent;
  let fixture: ComponentFixture<EditEventDateChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventDateChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventDateChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
