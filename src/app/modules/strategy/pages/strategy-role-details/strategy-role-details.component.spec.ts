import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyRoleDetailsComponent } from './strategy-role-details.component';

describe('StrategyRoleDetailsComponent', () => {
  let component: StrategyRoleDetailsComponent;
  let fixture: ComponentFixture<StrategyRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyRoleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
