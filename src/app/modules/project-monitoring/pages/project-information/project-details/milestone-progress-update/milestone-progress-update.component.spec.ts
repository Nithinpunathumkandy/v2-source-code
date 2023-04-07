import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneProgressUpdateComponent } from './milestone-progress-update.component';

describe('MilestoneProgressUpdateComponent', () => {
  let component: MilestoneProgressUpdateComponent;
  let fixture: ComponentFixture<MilestoneProgressUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneProgressUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneProgressUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
