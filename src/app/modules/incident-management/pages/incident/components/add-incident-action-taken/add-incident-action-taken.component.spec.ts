import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentActionTakenComponent } from './add-incident-action-taken.component';

describe('AddIncidentActionTakenComponent', () => {
  let component: AddIncidentActionTakenComponent;
  let fixture: ComponentFixture<AddIncidentActionTakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentActionTakenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentActionTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
