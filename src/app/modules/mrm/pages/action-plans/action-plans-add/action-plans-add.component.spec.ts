import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlansAddComponent } from './action-plans-add.component';

describe('ActionPlansAddComponent', () => {
  let component: ActionPlansAddComponent;
  let fixture: ComponentFixture<ActionPlansAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlansAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlansAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
