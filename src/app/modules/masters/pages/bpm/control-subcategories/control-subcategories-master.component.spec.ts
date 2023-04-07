import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSubcategoriesMasterComponent } from './control-subcategories-master.component';

describe('ControlSubcategoriesMasterComponent', () => {
  let component: ControlSubcategoriesMasterComponent;
  let fixture: ComponentFixture<ControlSubcategoriesMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlSubcategoriesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSubcategoriesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
