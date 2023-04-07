import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyProfileStatusComponent } from './strategy-profile-status.component';

describe('StrategyProfileStatusComponent', () => {
  let component: StrategyProfileStatusComponent;
  let fixture: ComponentFixture<StrategyProfileStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyProfileStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyProfileStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
