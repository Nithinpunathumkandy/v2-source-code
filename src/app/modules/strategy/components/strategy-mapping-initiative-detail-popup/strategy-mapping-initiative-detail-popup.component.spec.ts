import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingInitiativeDetailPopupComponent } from './strategy-mapping-initiative-detail-popup.component';

describe('StrategyMappingInitiativeDetailPopupComponent', () => {
  let component: StrategyMappingInitiativeDetailPopupComponent;
  let fixture: ComponentFixture<StrategyMappingInitiativeDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingInitiativeDetailPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingInitiativeDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
