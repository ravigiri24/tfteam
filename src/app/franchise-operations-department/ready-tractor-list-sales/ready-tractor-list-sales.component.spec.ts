import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadyTractorListSalesComponent } from './ready-tractor-list-sales.component';

describe('ReadyTractorListSalesComponent', () => {
  let component: ReadyTractorListSalesComponent;
  let fixture: ComponentFixture<ReadyTractorListSalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyTractorListSalesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadyTractorListSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
