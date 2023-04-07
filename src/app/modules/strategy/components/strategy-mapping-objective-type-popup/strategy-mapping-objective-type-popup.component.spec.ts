import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingObjectiveTypePopupComponent } from './strategy-mapping-objective-type-popup.component';

describe('StrategyMappingObjectiveTypePopupComponent', () => {
  let component: StrategyMappingObjectiveTypePopupComponent;
  let fixture: ComponentFixture<StrategyMappingObjectiveTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingObjectiveTypePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingObjectiveTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
