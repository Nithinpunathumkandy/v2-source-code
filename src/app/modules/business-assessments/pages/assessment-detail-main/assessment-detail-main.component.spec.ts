import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentDetailMainComponent } from './assessment-detail-main.component';

describe('AssessmentDetailMainComponent', () => {
  let component: AssessmentDetailMainComponent;
  let fixture: ComponentFixture<AssessmentDetailMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentDetailMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDetailMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
