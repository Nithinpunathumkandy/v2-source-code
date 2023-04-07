import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillScopesComponent } from './mock-drill-scopes.component';

describe('MockDrillScopesComponent', () => {
  let component: MockDrillScopesComponent;
  let fixture: ComponentFixture<MockDrillScopesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillScopesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillScopesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
