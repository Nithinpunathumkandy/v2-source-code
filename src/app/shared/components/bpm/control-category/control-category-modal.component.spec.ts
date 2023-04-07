import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCategoryModalComponent } from './control-category-modal.component';

describe('ControlCategoryModalComponent', () => {
  let component: ControlCategoryModalComponent;
  let fixture: ComponentFixture<ControlCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
