import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStrategyicAlignmentComponent } from './add-strategyic-alignment.component';

describe('AddStrategyicAlignmentComponent', () => {
  let component: AddStrategyicAlignmentComponent;
  let fixture: ComponentFixture<AddStrategyicAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStrategyicAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStrategyicAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
