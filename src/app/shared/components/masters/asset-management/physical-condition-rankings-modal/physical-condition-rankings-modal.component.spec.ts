import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalConditionRankingsModalComponent } from './physical-condition-rankings-modal.component';

describe('PhysicalConditionRankingsModalComponent', () => {
  let component: PhysicalConditionRankingsModalComponent;
  let fixture: ComponentFixture<PhysicalConditionRankingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalConditionRankingsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalConditionRankingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
