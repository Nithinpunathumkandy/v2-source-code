import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRootCauseAnalysisModalComponent } from './add-root-cause-analysis-modal.component';

describe('AddRootCauseAnalysisModalComponent', () => {
  let component: AddRootCauseAnalysisModalComponent;
  let fixture: ComponentFixture<AddRootCauseAnalysisModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRootCauseAnalysisModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRootCauseAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
