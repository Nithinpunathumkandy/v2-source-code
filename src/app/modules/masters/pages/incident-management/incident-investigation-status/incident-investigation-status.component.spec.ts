import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInvestigationStatusComponent } from './incident-investigation-status.component';

describe('IncidentInvestigationStatusComponent', () => {
  let component: IncidentInvestigationStatusComponent;
  let fixture: ComponentFixture<IncidentInvestigationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInvestigationStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInvestigationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
