import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDocumentSearchComponent } from './master-document-search.component';

describe('MasterDocumentSearchComponent', () => {
  let component: MasterDocumentSearchComponent;
  let fixture: ComponentFixture<MasterDocumentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDocumentSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDocumentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
