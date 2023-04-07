import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyObjectiveTypeComponent } from './strategy-objective-type.component';

describe('StrategyObjectiveTypeComponent', () => {
  let component: StrategyObjectiveTypeComponent;
  let fixture: ComponentFixture<StrategyObjectiveTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyObjectiveTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyObjectiveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
