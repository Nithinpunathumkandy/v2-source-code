import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventOutcomeComponent } from './add-event-outcome.component';

describe('AddEventOutcomeComponent', () => {
  let component: AddEventOutcomeComponent;
  let fixture: ComponentFixture<AddEventOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventOutcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
