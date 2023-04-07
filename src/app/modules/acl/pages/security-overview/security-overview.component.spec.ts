import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityOverviewComponent } from './security-overview.component';

describe('SecurityOverviewComponent', () => {
  let component: SecurityOverviewComponent;
  let fixture: ComponentFixture<SecurityOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
