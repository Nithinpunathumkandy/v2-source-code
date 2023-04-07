import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentInvestigationsModalComponent } from './add-incident-investigations-modal.component';

describe('AddIncidentInvestigationsModalComponent', () => {
  let component: AddIncidentInvestigationsModalComponent;
  let fixture: ComponentFixture<AddIncidentInvestigationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentInvestigationsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentInvestigationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
