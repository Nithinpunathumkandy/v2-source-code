import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlanActivityLogsComponent } from './improvement-plan-activity-logs.component';

describe('ImprovementPlanActivityLogsComponent', () => {
  let component: ImprovementPlanActivityLogsComponent;
  let fixture: ComponentFixture<ImprovementPlanActivityLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlanActivityLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlanActivityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
