import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskMappingComponent } from './isms-risk-mapping.component';

describe('IsmsRiskMappingComponent', () => {
  let component: IsmsRiskMappingComponent;
  let fixture: ComponentFixture<IsmsRiskMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
