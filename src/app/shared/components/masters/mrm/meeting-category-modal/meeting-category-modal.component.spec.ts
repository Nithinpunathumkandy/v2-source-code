import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCategoryModalComponent } from './meeting-category-modal.component';

describe('MeetingCategoryModalComponent', () => {
  let component: MeetingCategoryModalComponent;
  let fixture: ComponentFixture<MeetingCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
