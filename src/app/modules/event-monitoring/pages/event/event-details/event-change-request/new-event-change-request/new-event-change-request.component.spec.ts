import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventChangeRequestComponent } from './new-event-change-request.component';

describe('NewEventChangeRequestComponent', () => {
  let component: NewEventChangeRequestComponent;
  let fixture: ComponentFixture<NewEventChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEventChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEventChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
