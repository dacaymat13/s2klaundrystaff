import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustViewComponent } from './cust-view.component';

describe('CustViewComponent', () => {
  let component: CustViewComponent;
  let fixture: ComponentFixture<CustViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
