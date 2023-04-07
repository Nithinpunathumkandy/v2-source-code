import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemLoaderComponent } from './auditable-item-loader.component';

describe('AuditableItemLoaderComponent', () => {
  let component: AuditableItemLoaderComponent;
  let fixture: ComponentFixture<AuditableItemLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
