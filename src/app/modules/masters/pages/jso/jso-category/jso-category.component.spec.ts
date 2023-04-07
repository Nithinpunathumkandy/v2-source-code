import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoCategoryComponent } from './jso-category.component';

describe('JsoCategoryComponent', () => {
  let component: JsoCategoryComponent;
  let fixture: ComponentFixture<JsoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
