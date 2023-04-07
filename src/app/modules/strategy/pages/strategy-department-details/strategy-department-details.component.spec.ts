import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDepartmentDetailsComponent } from './strategy-department-details.component';

describe('StrategyDepartmentDetailsComponent', () => {
  let component: StrategyDepartmentDetailsComponent;
  let fixture: ComponentFixture<StrategyDepartmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyDepartmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDepartmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
