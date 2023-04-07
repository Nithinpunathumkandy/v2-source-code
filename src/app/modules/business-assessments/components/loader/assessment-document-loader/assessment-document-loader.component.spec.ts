import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDocumentLoaderComponent } from './assessment-document-loader.component';

describe('AssessmentDocumentLoaderComponent', () => {
  let component: AssessmentDocumentLoaderComponent;
  let fixture: ComponentFixture<AssessmentDocumentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentDocumentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDocumentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
