import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmByCategoryComponent } from './hm-by-category.component';

describe('HmByCategoryComponent', () => {
  let component: HmByCategoryComponent;
  let fixture: ComponentFixture<HmByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmByCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
