import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingObjectiveLoaderComponent } from './strategy-mapping-objective-loader.component';

describe('StrategyMappingObjectiveLoaderComponent', () => {
  let component: StrategyMappingObjectiveLoaderComponent;
  let fixture: ComponentFixture<StrategyMappingObjectiveLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingObjectiveLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingObjectiveLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
