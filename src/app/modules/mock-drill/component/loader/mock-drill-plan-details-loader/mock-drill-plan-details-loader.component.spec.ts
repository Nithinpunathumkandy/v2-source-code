import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPlanDetailsLoaderComponent } from './mock-drill-plan-details-loader.component';

describe('MockDrillPlanDetailsLoaderComponent', () => {
  let component: MockDrillPlanDetailsLoaderComponent;
  let fixture: ComponentFixture<MockDrillPlanDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillPlanDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPlanDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
