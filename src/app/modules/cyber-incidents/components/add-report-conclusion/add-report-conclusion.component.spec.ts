import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportConclusionComponent } from './add-report-conclusion.component';

describe('AddReportConclusionComponent', () => {
  let component: AddReportConclusionComponent;
  let fixture: ComponentFixture<AddReportConclusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportConclusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReportConclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
