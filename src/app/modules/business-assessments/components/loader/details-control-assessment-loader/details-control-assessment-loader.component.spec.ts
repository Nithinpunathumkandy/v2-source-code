import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsControlAssessmentLoaderComponent } from './details-control-assessment-loader.component';

describe('DetailsControlAssessmentLoaderComponent', () => {
  let component: DetailsControlAssessmentLoaderComponent;
  let fixture: ComponentFixture<DetailsControlAssessmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsControlAssessmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsControlAssessmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
