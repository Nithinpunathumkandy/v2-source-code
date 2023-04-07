import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventChangeRequestComponent } from './edit-event-change-request.component';

describe('EditEventChangeRequestComponent', () => {
  let component: EditEventChangeRequestComponent;
  let fixture: ComponentFixture<EditEventChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
