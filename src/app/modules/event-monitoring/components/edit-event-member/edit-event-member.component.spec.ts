import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventMemberComponent } from './edit-event-member.component';

describe('EditEventMemberComponent', () => {
  let component: EditEventMemberComponent;
  let fixture: ComponentFixture<EditEventMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
