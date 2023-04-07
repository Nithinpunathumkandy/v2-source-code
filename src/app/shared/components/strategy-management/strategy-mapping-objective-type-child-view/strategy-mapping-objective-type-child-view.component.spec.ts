import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingObjectiveTypeChildViewComponent } from './strategy-mapping-objective-type-child-view.component';

describe('StrategyMappingObjectiveTypeChildViewComponent', () => {
  let component: StrategyMappingObjectiveTypeChildViewComponent;
  let fixture: ComponentFixture<StrategyMappingObjectiveTypeChildViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingObjectiveTypeChildViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingObjectiveTypeChildViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
