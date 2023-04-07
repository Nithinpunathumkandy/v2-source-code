import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyStatusComponent } from './strategy-status.component';

describe('StrategyStatusComponent', () => {
  let component: StrategyStatusComponent;
  let fixture: ComponentFixture<StrategyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
