import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPlanMainTabComponent } from './annual-plan-main-tab.component';

describe('AnnualPlanMainTabComponent', () => {
  let component: AnnualPlanMainTabComponent;
  let fixture: ComponentFixture<AnnualPlanMainTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPlanMainTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPlanMainTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
