import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateAddComponent } from './kh-template-add.component';

describe('KhTemplateAddComponent', () => {
  let component: KhTemplateAddComponent;
  let fixture: ComponentFixture<KhTemplateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
