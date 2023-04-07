import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpChangeRequestSubcomponentComponent } from './bcp-change-request-subcomponent.component';

describe('BcpChangeRequestSubcomponentComponent', () => {
  let component: BcpChangeRequestSubcomponentComponent;
  let fixture: ComponentFixture<BcpChangeRequestSubcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpChangeRequestSubcomponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpChangeRequestSubcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
