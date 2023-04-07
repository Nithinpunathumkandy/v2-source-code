import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentUserIndividualLoaderComponent } from './assessment-user-individual-loader.component';

describe('AssessmentUserIndividualLoaderComponent', () => {
  let component: AssessmentUserIndividualLoaderComponent;
  let fixture: ComponentFixture<AssessmentUserIndividualLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentUserIndividualLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentUserIndividualLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
