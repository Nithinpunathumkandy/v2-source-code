import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyFocusAreaComponent } from './strategy-focus-area.component';

describe('StrategyFocusAreaComponent', () => {
  let component: StrategyFocusAreaComponent;
  let fixture: ComponentFixture<StrategyFocusAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyFocusAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyFocusAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
