import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlansDetailsComponent } from './action-plans-details.component';

describe('ActionPlansDetailsComponent', () => {
  let component: ActionPlansDetailsComponent;
  let fixture: ComponentFixture<ActionPlansDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlansDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlansDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
