import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateInternalComponent } from './kh-template-internal.component';

describe('KhTemplateInternalComponent', () => {
  let component: KhTemplateInternalComponent;
  let fixture: ComponentFixture<KhTemplateInternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateInternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
