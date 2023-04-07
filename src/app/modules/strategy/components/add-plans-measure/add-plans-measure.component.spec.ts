import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlansMeasureComponent } from './add-plans-measure.component';

describe('AddPlansMeasureComponent', () => {
  let component: AddPlansMeasureComponent;
  let fixture: ComponentFixture<AddPlansMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlansMeasureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlansMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
