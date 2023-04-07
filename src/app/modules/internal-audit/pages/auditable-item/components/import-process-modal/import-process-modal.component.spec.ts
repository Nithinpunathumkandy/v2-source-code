import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProcessModalComponent } from './import-process-modal.component';

describe('ImportProcessModalComponent', () => {
  let component: ImportProcessModalComponent;
  let fixture: ComponentFixture<ImportProcessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportProcessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProcessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
