import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainceChecklitDetailsComponent } from './complaince-checklit-details.component';

describe('ComplainceChecklitDetailsComponent', () => {
  let component: ComplainceChecklitDetailsComponent;
  let fixture: ComponentFixture<ComplainceChecklitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplainceChecklitDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainceChecklitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
