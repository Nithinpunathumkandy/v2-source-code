import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpLoaderComponent } from './follow-up-loader.component';

describe('FollowUpLoaderComponent', () => {
  let component: FollowUpLoaderComponent;
  let fixture: ComponentFixture<FollowUpLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
