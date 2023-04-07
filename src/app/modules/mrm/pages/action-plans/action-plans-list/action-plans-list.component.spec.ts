import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlansListComponent } from './action-plans-list.component';

describe('ActionPlansListComponent', () => {
  let component: ActionPlansListComponent;
  let fixture: ComponentFixture<ActionPlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
