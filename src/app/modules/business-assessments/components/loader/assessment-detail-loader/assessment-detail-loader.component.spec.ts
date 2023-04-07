import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDetailLoaderComponent } from './assessment-detail-loader.component';

describe('AssessmentDetailLoaderComponent', () => {
  let component: AssessmentDetailLoaderComponent;
  let fixture: ComponentFixture<AssessmentDetailLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentDetailLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDetailLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
