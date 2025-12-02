import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnquiryListSalesHeadComponent } from './enquiry-list-sales-head.component';

describe('EnquiryListSalesHeadComponent', () => {
  let component: EnquiryListSalesHeadComponent;
  let fixture: ComponentFixture<EnquiryListSalesHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryListSalesHeadComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiryListSalesHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
