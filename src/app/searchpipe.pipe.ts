import {Pipe,PipeTransform} from '@angular/core'
@Pipe({
    name: 'searchItem',
    pure: false,
  })
  export class SearchpipePipe implements PipeTransform {
    constructor() {}
    transform(items: any[], field: any[], value: string): any {
        
        if (!items || !value || !field) {
            return items;
          }
      
          let lowSearch = value.toLowerCase();
          return items.filter((item) => {
            return field.some(key =>
              String(item[key]).toLowerCase().includes(lowSearch)
            );
          });
      }
  }
  
