import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {


  transform(items: any[], searchText: string, field?: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (field) {
        return item[field]?.toString().toLowerCase().includes(searchText);
      } else {
        // Search across all fields if no field is specified
        return Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(searchText)
        );
      }
    });
  }
}
