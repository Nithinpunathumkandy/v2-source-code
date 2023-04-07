import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryCategoryComponent } from './industry-category.component';

describe('IndustryCategoryComponent', () => {
  let component: IndustryCategoryComponent;
  let fixture: ComponentFixture<IndustryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
