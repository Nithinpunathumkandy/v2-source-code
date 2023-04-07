import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingObjectiveInfoComponent } from './strategy-mapping-objective-info.component';

describe('StrategyMappingObjectiveInfoComponent', () => {
  let component: StrategyMappingObjectiveInfoComponent;
  let fixture: ComponentFixture<StrategyMappingObjectiveInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingObjectiveInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingObjectiveInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
