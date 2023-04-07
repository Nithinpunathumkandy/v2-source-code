import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainceChecklistComponent } from './complaince-checklist.component';

describe('ComplainceChecklistComponent', () => {
  let component: ComplainceChecklistComponent;
  let fixture: ComponentFixture<ComplainceChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplainceChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainceChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
