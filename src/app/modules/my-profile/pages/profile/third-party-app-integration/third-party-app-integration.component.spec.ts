import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyAppIntegrationComponent } from './third-party-app-integration.component';

describe('ThirdPartyAppIntegrationComponent', () => {
  let component: ThirdPartyAppIntegrationComponent;
  let fixture: ComponentFixture<ThirdPartyAppIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdPartyAppIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyAppIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
