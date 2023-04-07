import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingPopupComponent } from './strategy-mapping-popup.component';

describe('StrategyMappingPopupComponent', () => {
  let component: StrategyMappingPopupComponent;
  let fixture: ComponentFixture<StrategyMappingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
