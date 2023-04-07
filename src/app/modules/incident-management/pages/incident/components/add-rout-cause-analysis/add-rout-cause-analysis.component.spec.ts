import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoutCauseAnalysisComponent } from './add-rout-cause-analysis.component';

describe('AddRoutCauseAnalysisComponent', () => {
  let component: AddRoutCauseAnalysisComponent;
  let fixture: ComponentFixture<AddRoutCauseAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRoutCauseAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoutCauseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
