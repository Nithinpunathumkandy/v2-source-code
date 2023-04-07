import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateListLoaderComponent } from './kh-template-list-loader.component';

describe('KhTemplateListLoaderComponent', () => {
  let component: KhTemplateListLoaderComponent;
  let fixture: ComponentFixture<KhTemplateListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
