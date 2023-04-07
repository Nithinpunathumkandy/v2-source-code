import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateDetailsComponent } from './kh-template-details.component';

describe('KhTemplateDetailsComponent', () => {
  let component: KhTemplateDetailsComponent;
  let fixture: ComponentFixture<KhTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
