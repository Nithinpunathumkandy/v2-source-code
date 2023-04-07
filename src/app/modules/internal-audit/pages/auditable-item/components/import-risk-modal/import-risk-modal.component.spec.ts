import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRiskModalComponent } from './import-risk-modal.component';

describe('ImportRiskModalComponent', () => {
  let component: ImportRiskModalComponent;
  let fixture: ComponentFixture<ImportRiskModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportRiskModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRiskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
