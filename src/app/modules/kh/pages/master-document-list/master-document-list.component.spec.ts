import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDocumentListComponent } from './master-document-list.component';

describe('MasterDocumentListComponent', () => {
  let component: MasterDocumentListComponent;
  let fixture: ComponentFixture<MasterDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDocumentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
