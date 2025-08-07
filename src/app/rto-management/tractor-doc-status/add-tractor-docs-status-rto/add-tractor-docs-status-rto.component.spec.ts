import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddTractorDocsStatusRtoComponent } from './add-tractor-docs-status-rto.component';

describe('AddTractorDocsStatusRtoComponent', () => {
  let component: AddTractorDocsStatusRtoComponent;
  let fixture: ComponentFixture<AddTractorDocsStatusRtoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTractorDocsStatusRtoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTractorDocsStatusRtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
