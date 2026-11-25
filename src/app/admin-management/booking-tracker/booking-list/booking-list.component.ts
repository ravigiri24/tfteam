import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent {
  @Input() bookings: any[] = [];
  @Input() title = 'Bookings';
  @Input() listColorClass = 'secondColor';

  headerDisplayArray = [{ name: 'Close', icon: 'close-circle' }];
  selectedAgeFilter: 'all' | 'older7' | 'older25' = 'all';

  get olderThan7Bookings(): any[] {
    return this.bookings.filter(booking => this.bookingAgeClass(booking?.booking_date) !== '');
  }

  get olderThan25Bookings(): any[] {
    return this.bookings.filter(booking => this.bookingAgeClass(booking?.booking_date) === 'booking-overdue');
  }

  get filteredBookings(): any[] {
    if (this.selectedAgeFilter === 'older7') {
      return this.olderThan7Bookings;
    }
    if (this.selectedAgeFilter === 'older25') {
      return this.olderThan25Bookings;
    }
    return this.bookings;
  }

  bookingFields = [
    { key: 'tractor_name', heading: 'Tractor Name' },
    { key: 'createdOn', heading: 'Created On', format: 'date' },
    { key: 'booking_date', heading: 'Booking Date', format: 'date' },
    { key: 'tfCode', heading: 'TF Code' },
    { key: 'approvePrice', heading: 'Request Amount For Sale', format: 'number' },
    { key: 'expectedPrice', heading: 'Price Of Tractor', format: 'number' },
    { key: 'booking_price', heading: 'Advance', format: 'number' },
    { key: 'sale_type', heading: 'Sale Type' },
    { key: 'customerName', heading: 'Customer Name' },
    { key: 'mobileNo', heading: 'Mobile No' },
    { key: 'stateName', heading: 'State' },
    { key: 'cityName', heading: 'City' },
    { key: 'village', heading: 'Village' },
    { key: 'expectedDateOfSale', heading: 'Expected Date', format: 'date' },
    { key: 'requestByName', heading: 'Request By' },

    { key: 'remark', heading: 'Remark' },
    { key: 'storeName', heading: 'Store' },

  ];

  constructor(private modalCtrl: ModalController) {}

  bookingAgeClass(bookingDate: string | number | Date | null | undefined): string {
    if (bookingDate == null || bookingDate === '') {
      return '';
    }
    const date = bookingDate instanceof Date ? bookingDate : new Date(bookingDate);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const today = new Date();
    // Compare calendar days so time of day and daylight saving do not shift the thresholds.
    const ageInDays = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
      - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000;
    return ageInDays > 25 ? 'booking-overdue' : ageInDays > 7 ? 'booking-warning' : '';
  }

  actionEventHeader(event: any) {
    if (event?.name === 'Close') {
      this.modalCtrl.dismiss();
    }
  }
}
