import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpInfoComponent } from './follow-up-info.component';

describe('FollowUpInfoComponent', () => {
  let component: FollowUpInfoComponent;
  let fixture: ComponentFixture<FollowUpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
