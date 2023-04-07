import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSubsidiaryLoaderComponent } from './assessment-subsidiary-loader.component';

describe('AssessmentSubsidiaryLoaderComponent', () => {
  let component: AssessmentSubsidiaryLoaderComponent;
  let fixture: ComponentFixture<AssessmentSubsidiaryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentSubsidiaryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentSubsidiaryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
