import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyObjectiveModalComponent } from './strategy-objective-modal.component';

describe('StrategyObjectiveModalComponent', () => {
  let component: StrategyObjectiveModalComponent;
  let fixture: ComponentFixture<StrategyObjectiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyObjectiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
