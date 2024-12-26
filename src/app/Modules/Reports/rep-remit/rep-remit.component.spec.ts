import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepRemitComponent } from './rep-remit.component';

describe('RepRemitComponent', () => {
  let component: RepRemitComponent;
  let fixture: ComponentFixture<RepRemitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepRemitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepRemitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
