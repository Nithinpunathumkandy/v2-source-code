import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDashbaordLoaderComponent } from './strategy-dashbaord-loader.component';

describe('StrategyDashbaordLoaderComponent', () => {
  let component: StrategyDashbaordLoaderComponent;
  let fixture: ComponentFixture<StrategyDashbaordLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyDashbaordLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDashbaordLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
