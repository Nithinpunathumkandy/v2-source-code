import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenuDropDownComponent } from './sub-menu-drop-down.component';

describe('SubMenuDropDownComponent', () => {
  let component: SubMenuDropDownComponent;
  let fixture: ComponentFixture<SubMenuDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMenuDropDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
