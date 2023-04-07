import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillActionPlanHistoryModalComponent } from './mock-drill-action-plan-history-modal.component';

describe('MockDrillActionPlanHistoryModalComponent', () => {
  let component: MockDrillActionPlanHistoryModalComponent;
  let fixture: ComponentFixture<MockDrillActionPlanHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillActionPlanHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillActionPlanHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
