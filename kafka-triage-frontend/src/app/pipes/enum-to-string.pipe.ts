import { Pipe, PipeTransform } from '@angular/core';
import { FilterOperation } from "../filter/Filter";

@Pipe({
  name: 'enumToString'
})
export class EnumToStringPipe implements PipeTransform {
  enumToDisplayName = new Map();

  constructor() {
    // FilterOperation
    this.enumToDisplayName.set(FilterOperation.EQUALS, '= Equals');
    this.enumToDisplayName.set(FilterOperation.NOT_EQUALS, '!= Not Equals');
    this.enumToDisplayName.set(FilterOperation.GREATER_THAN, '> Greater Than');
    this.enumToDisplayName.set(FilterOperation.GREATER_THAN_OR_EQUAL, '>= Greater Than Or Equal To');
    this.enumToDisplayName.set(FilterOperation.LESS_THAN, '< Less Than');
    this.enumToDisplayName.set(FilterOperation.LESS_THAN_OR_EQUAL, '<= Less Than Or Equal To');
    this.enumToDisplayName.set(FilterOperation.REGEX, '.* Regex');
  }

  transform(enumName: any): unknown {
    if (this.enumToDisplayName.has(enumName)) {
      return this.enumToDisplayName.get(enumName);
    }
    return enumName;
  }

}
