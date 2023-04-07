import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceMangementPreviewComponent } from './compliance-mangement-preview.component';

describe('ComplianceMangementPreviewComponent', () => {
  let component: ComplianceMangementPreviewComponent;
  let fixture: ComponentFixture<ComplianceMangementPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceMangementPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceMangementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
