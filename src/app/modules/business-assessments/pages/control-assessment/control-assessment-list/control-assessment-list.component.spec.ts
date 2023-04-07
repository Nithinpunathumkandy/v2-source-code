import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentListComponent } from './control-assessment-list.component';

describe('ControlAssessmentListComponent', () => {
  let component: ControlAssessmentListComponent;
  let fixture: ComponentFixture<ControlAssessmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
