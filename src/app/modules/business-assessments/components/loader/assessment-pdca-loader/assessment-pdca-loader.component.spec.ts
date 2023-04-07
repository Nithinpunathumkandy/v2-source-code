import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentPdcaLoaderComponent } from './assessment-pdca-loader.component';

describe('AssessmentPdcaLoaderComponent', () => {
  let component: AssessmentPdcaLoaderComponent;
  let fixture: ComponentFixture<AssessmentPdcaLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentPdcaLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPdcaLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
