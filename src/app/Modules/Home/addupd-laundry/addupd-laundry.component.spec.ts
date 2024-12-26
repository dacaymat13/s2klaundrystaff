import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddupdLaundryComponent } from './addupd-laundry.component';

describe('AddupdLaundryComponent', () => {
  let component: AddupdLaundryComponent;
  let fixture: ComponentFixture<AddupdLaundryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddupdLaundryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddupdLaundryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
