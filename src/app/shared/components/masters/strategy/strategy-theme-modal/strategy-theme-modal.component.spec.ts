import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyThemeModalComponent } from './strategy-theme-modal.component';

describe('StrategyThemeModalComponent', () => {
  let component: StrategyThemeModalComponent;
  let fixture: ComponentFixture<StrategyThemeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyThemeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyThemeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
