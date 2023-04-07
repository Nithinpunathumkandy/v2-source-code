import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlAssessmentLoaderComponent } from './control-assessment-loader.component';

describe('ControlAssessmentLoaderComponent', () => {
  let component: ControlAssessmentLoaderComponent;
  let fixture: ComponentFixture<ControlAssessmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlAssessmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlAssessmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
