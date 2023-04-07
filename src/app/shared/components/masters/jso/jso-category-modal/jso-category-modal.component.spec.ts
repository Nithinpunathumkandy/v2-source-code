import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoCategoryModalComponent } from './jso-category-modal.component';

describe('JsoCategoryModalComponent', () => {
  let component: JsoCategoryModalComponent;
  let fixture: ComponentFixture<JsoCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
