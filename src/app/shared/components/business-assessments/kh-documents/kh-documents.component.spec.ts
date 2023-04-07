import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhDocumentsComponent } from './kh-documents.component';

describe('KhDocumentsComponent', () => {
  let component: KhDocumentsComponent;
  let fixture: ComponentFixture<KhDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
