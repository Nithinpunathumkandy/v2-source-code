import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateExternalComponent } from './kh-template-external.component';

describe('KhTemplateExternalComponent', () => {
  let component: KhTemplateExternalComponent;
  let fixture: ComponentFixture<KhTemplateExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
