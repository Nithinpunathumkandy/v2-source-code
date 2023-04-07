import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentReportedAtComponent } from './add-incident-reported-at.component';

describe('AddIncidentReportedAtComponent', () => {
  let component: AddIncidentReportedAtComponent;
  let fixture: ComponentFixture<AddIncidentReportedAtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentReportedAtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentReportedAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
