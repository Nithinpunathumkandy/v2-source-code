import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveTargetBreakdownModalComponent } from './objective-target-breakdown-modal.component';

describe('ObjectiveTargetBreakdownModalComponent', () => {
  let component: ObjectiveTargetBreakdownModalComponent;
  let fixture: ComponentFixture<ObjectiveTargetBreakdownModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveTargetBreakdownModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveTargetBreakdownModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
