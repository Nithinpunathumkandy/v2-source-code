import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingObjectiveDetailPopupComponent } from './strategy-mapping-objective-detail-popup.component';

describe('StrategyMappingObjectiveDetailPopupComponent', () => {
  let component: StrategyMappingObjectiveDetailPopupComponent;
  let fixture: ComponentFixture<StrategyMappingObjectiveDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingObjectiveDetailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingObjectiveDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
