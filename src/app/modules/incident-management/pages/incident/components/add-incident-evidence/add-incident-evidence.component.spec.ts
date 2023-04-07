import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentEvidenceComponent } from './add-incident-evidence.component';

describe('AddIncidentEvidenceComponent', () => {
  let component: AddIncidentEvidenceComponent;
  let fixture: ComponentFixture<AddIncidentEvidenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentEvidenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
