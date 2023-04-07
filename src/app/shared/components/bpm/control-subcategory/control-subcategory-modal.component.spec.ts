import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSubcategoryModalComponent } from './control-subcategory-modal.component';

describe('ControlSubcategoryModalComponent', () => {
  let component: ControlSubcategoryModalComponent;
  let fixture: ComponentFixture<ControlSubcategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlSubcategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSubcategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
