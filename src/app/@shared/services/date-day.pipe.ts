import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDay'
})
export class DateDayPipe implements PipeTransform {

  transform(value: string): string {
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - new Date(value).getTime();
    const diffInHours = Math.floor(diffInTime / (1000 * 3600));
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 0 && diffInHours === 0) {
      return 'Just now';
    }

    if (diffInDays === 0) {
      return `${diffInHours}h`;
    }

    if (diffInDays === 1) {
      return '1d';
    }

    return `${diffInDays}d`;
  }
}
