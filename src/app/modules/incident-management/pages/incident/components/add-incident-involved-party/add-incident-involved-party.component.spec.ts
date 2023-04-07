import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentInvolvedPartyComponent } from './add-incident-involved-party.component';

describe('AddIncidentInvolvedPartyComponent', () => {
  let component: AddIncidentInvolvedPartyComponent;
  let fixture: ComponentFixture<AddIncidentInvolvedPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentInvolvedPartyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentInvolvedPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
