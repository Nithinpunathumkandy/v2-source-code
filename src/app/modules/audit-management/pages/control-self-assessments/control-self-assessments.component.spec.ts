import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSelfAssessmentsComponent } from './control-self-assessments.component';

describe('ControlSelfAssessmentsComponent', () => {
  let component: ControlSelfAssessmentsComponent;
  let fixture: ComponentFixture<ControlSelfAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlSelfAssessmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSelfAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
