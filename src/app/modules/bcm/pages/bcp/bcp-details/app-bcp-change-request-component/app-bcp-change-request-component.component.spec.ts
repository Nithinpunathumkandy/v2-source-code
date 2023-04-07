import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpChangeRequestPageComponent } from './app-bcp-change-request-component.component';

describe('BcpChangeRequestPageComponent', () => {
  let component: BcpChangeRequestPageComponent;
  let fixture: ComponentFixture<BcpChangeRequestPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpChangeRequestPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpChangeRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
