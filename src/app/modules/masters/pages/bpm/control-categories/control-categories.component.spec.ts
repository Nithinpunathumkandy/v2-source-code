import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCategoriesComponent } from './control-categories.component';

describe('ControlCategoriesComponent', () => {
  let component: ControlCategoriesComponent;
  let fixture: ComponentFixture<ControlCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
