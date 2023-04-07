import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentReportedByComponent } from './add-incident-reported-by.component';

describe('AddIncidentReportedByComponent', () => {
  let component: AddIncidentReportedByComponent;
  let fixture: ComponentFixture<AddIncidentReportedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentReportedByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentReportedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
