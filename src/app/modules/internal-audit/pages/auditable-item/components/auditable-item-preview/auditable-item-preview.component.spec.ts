import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemPreviewComponent } from './auditable-item-preview.component';

describe('AuditableItemPreviewComponent', () => {
  let component: AuditableItemPreviewComponent;
  let fixture: ComponentFixture<AuditableItemPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
