import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsHmBySectionComponent } from './isms-hm-by-section.component';

describe('IsmsHmBySectionComponent', () => {
  let component: IsmsHmBySectionComponent;
  let fixture: ComponentFixture<IsmsHmBySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsHmBySectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsHmBySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
