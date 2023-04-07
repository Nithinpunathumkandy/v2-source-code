import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventDeliverablesChangeRequestComponent } from './edit-event-deliverables-change-request.component';

describe('EditEventDeliverablesChangeRequestComponent', () => {
  let component: EditEventDeliverablesChangeRequestComponent;
  let fixture: ComponentFixture<EditEventDeliverablesChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventDeliverablesChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventDeliverablesChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
