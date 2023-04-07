import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPlanListComponent } from './mock-drill-plan-list.component';

describe('MockDrillPlanListComponent', () => {
  let component: MockDrillPlanListComponent;
  let fixture: ComponentFixture<MockDrillPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
