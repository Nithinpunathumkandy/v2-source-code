import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyObjectiveTypesModalComponent } from './strategy-objective-types-modal.component';

describe('StrategyObjectiveTypesModalComponent', () => {
  let component: StrategyObjectiveTypesModalComponent;
  let fixture: ComponentFixture<StrategyObjectiveTypesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyObjectiveTypesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyObjectiveTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
