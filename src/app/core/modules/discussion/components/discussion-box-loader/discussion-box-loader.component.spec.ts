import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionBoxLoaderComponent } from './discussion-box-loader.component';

describe('DiscussionBoxLoaderComponent', () => {
  let component: DiscussionBoxLoaderComponent;
  let fixture: ComponentFixture<DiscussionBoxLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionBoxLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionBoxLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
