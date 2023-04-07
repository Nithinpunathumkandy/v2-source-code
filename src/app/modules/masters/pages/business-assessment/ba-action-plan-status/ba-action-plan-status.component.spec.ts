import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaActionPlanStatusComponent } from './ba-action-plan-status.component';

describe('BaActionPlanStatusComponent', () => {
  let component: BaActionPlanStatusComponent;
  let fixture: ComponentFixture<BaActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
