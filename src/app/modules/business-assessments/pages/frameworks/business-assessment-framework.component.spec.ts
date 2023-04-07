import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAssessmentFrameworkComponent } from './business-assessment-framework.component';

describe('BusinessAssessmentFrameworkComponent', () => {
  let component: BusinessAssessmentFrameworkComponent;
  let fixture: ComponentFixture<BusinessAssessmentFrameworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAssessmentFrameworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAssessmentFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
