import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListLoaderComponent } from './template-list-loader.component';

describe('TemplateListLoaderComponent', () => {
  let component: TemplateListLoaderComponent;
  let fixture: ComponentFixture<TemplateListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
