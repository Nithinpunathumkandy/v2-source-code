import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsHmByCategoryComponent } from './isms-hm-by-category.component';

describe('IsmsHmByCategoryComponent', () => {
  let component: IsmsHmByCategoryComponent;
  let fixture: ComponentFixture<IsmsHmByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsHmByCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsHmByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
