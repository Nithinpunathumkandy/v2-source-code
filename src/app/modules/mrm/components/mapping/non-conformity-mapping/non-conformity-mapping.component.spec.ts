import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConformityMappingComponent } from './non-conformity-mapping.component';

describe('NonConformityMappingComponent', () => {
  let component: NonConformityMappingComponent;
  let fixture: ComponentFixture<NonConformityMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConformityMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConformityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
