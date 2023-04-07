import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyObjectivesComponent } from './strategy-objectives.component';

describe('StrategyObjectivesComponent', () => {
  let component: StrategyObjectivesComponent;
  let fixture: ComponentFixture<StrategyObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyObjectivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
