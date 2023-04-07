import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTemplateListComponent } from './kh-template-list.component';

describe('KhTemplateListComponent', () => {
  let component: KhTemplateListComponent;
  let fixture: ComponentFixture<KhTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
