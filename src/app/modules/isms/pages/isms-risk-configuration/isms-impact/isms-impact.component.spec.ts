import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsImpactComponent } from './isms-impact.component';

describe('IsmsImpactComponent', () => {
  let component: IsmsImpactComponent;
  let fixture: ComponentFixture<IsmsImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsImpactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
