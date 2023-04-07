import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentMsTypeComponent } from './assessment-ms-type.component';

describe('AssessmentMsTypeComponent', () => {
  let component: AssessmentMsTypeComponent;
  let fixture: ComponentFixture<AssessmentMsTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentMsTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentMsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
