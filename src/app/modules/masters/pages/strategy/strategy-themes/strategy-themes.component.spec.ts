import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyThemesComponent } from './strategy-themes.component';

describe('StrategyThemesComponent', () => {
  let component: StrategyThemesComponent;
  let fixture: ComponentFixture<StrategyThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyThemesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
