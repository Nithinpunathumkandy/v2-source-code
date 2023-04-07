import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillActionPlanAddComponent } from './mock-drill-action-plan-add.component';

describe('MockDrillActionPlanAddComponent', () => {
  let component: MockDrillActionPlanAddComponent;
  let fixture: ComponentFixture<MockDrillActionPlanAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillActionPlanAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillActionPlanAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
