import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAddedActionPlanComponent } from './details-added-action-plan.component';

describe('DetailsAddedActionPlanComponent', () => {
  let component: DetailsAddedActionPlanComponent;
  let fixture: ComponentFixture<DetailsAddedActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsAddedActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAddedActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
