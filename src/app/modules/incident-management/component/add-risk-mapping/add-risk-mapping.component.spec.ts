import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskMappingComponent } from './add-risk-mapping.component';

describe('AddRiskMappingComponent', () => {
  let component: AddRiskMappingComponent;
  let fixture: ComponentFixture<AddRiskMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiskMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiskMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
