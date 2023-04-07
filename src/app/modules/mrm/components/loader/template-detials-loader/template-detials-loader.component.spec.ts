import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetialsLoaderComponent } from './template-detials-loader.component';

describe('TemplateDetialsLoaderComponent', () => {
  let component: TemplateDetialsLoaderComponent;
  let fixture: ComponentFixture<TemplateDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
