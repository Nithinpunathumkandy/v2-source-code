import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDocumentTypeComponent } from './assessment-document-type.component';

describe('AssessmentDocumentTypeComponent', () => {
  let component: AssessmentDocumentTypeComponent;
  let fixture: ComponentFixture<AssessmentDocumentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentDocumentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
