import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpChangeRequestComponent } from './bcp-change-request.component';

describe('BcpChangeRequestComponent', () => {
  let component: BcpChangeRequestComponent;
  let fixture: ComponentFixture<BcpChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
