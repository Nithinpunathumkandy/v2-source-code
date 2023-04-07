import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyActivityHistoryPopupComponent } from './strategy-activity-history-popup.component';

describe('StrategyActivityHistoryPopupComponent', () => {
  let component: StrategyActivityHistoryPopupComponent;
  let fixture: ComponentFixture<StrategyActivityHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyActivityHistoryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyActivityHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
