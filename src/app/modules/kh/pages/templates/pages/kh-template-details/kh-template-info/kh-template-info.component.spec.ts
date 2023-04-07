import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateInfoComponent } from './kh-template-info.component';

describe('KhTemplateInfoComponent', () => {
  let component: KhTemplateInfoComponent;
  let fixture: ComponentFixture<KhTemplateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
