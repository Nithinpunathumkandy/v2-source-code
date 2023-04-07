import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpChangeRequestTypesComponent } from './bcp-change-request-types.component';

describe('BcpChangeRequestTypesComponent', () => {
  let component: BcpChangeRequestTypesComponent;
  let fixture: ComponentFixture<BcpChangeRequestTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpChangeRequestTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpChangeRequestTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
