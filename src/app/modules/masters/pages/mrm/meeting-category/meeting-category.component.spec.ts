import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCategoryComponent } from './meeting-category.component';

describe('MeetingCategoryComponent', () => {
  let component: MeetingCategoryComponent;
  let fixture: ComponentFixture<MeetingCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
