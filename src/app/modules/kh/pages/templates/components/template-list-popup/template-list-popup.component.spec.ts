import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListPopupComponent } from './template-list-popup.component';

describe('TemplateListPopupComponent', () => {
  let component: TemplateListPopupComponent;
  let fixture: ComponentFixture<TemplateListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
