import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPlanByAuditorComponent } from './annual-plan-by-auditor.component';

describe('AnnualPlanByAuditorComponent', () => {
  let component: AnnualPlanByAuditorComponent;
  let fixture: ComponentFixture<AnnualPlanByAuditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPlanByAuditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPlanByAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
