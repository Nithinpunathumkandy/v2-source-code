import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillActionPlanUpdateModalComponent } from './mock-drill-action-plan-update-modal.component';

describe('MockDrillActionPlanUpdateModalComponent', () => {
  let component: MockDrillActionPlanUpdateModalComponent;
  let fixture: ComponentFixture<MockDrillActionPlanUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillActionPlanUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillActionPlanUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
