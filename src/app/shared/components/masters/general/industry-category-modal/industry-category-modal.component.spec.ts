import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryCategoryModalComponent } from './industry-category-modal.component';

describe('IndustryCategoryModalComponent', () => {
  let component: IndustryCategoryModalComponent;
  let fixture: ComponentFixture<IndustryCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndustryCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
