import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPlanNewComponent } from './mock-drill-plan-new.component';

describe('MockDrillPlanAddComponent', () => {
  let component: MockDrillPlanNewComponent;
  let fixture: ComponentFixture<MockDrillPlanNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockDrillPlanNewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPlanNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
