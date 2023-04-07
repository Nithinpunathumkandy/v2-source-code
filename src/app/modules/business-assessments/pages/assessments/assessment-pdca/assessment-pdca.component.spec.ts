import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentPdcaComponent } from './assessment-pdca.component';

describe('AssessmentPdcaComponent', () => {
  let component: AssessmentPdcaComponent;
  let fixture: ComponentFixture<AssessmentPdcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentPdcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentPdcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
