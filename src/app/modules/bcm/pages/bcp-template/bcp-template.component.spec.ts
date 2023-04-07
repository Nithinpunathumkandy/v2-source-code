import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpTemplateComponent } from './bcp-template.component';

describe('BcpTemplateComponent', () => {
  let component: BcpTemplateComponent;
  let fixture: ComponentFixture<BcpTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
