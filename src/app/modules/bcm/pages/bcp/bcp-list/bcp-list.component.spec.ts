import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpListComponent } from './bcp-list.component';

describe('BcpListComponent', () => {
  let component: BcpListComponent;
  let fixture: ComponentFixture<BcpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
