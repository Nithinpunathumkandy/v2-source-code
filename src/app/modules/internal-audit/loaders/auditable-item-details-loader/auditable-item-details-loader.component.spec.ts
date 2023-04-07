import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditableItemDetailsLoaderComponent } from './auditable-item-details-loader.component';

describe('AuditableItemDetailsLoaderComponent', () => {
  let component: AuditableItemDetailsLoaderComponent;
  let fixture: ComponentFixture<AuditableItemDetailsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditableItemDetailsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditableItemDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
