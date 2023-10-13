import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDay'
})
export class DateDayPipe implements PipeTransform {

  transform(value: string): string {
    const currentDate = new Date();
    const diffInTime = currentDate.getTime() - new Date(value).getTime();
    const diffInSeconds = Math.floor(diffInTime / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInSeconds / 3600);
    const diffInDays = Math.floor(diffInSeconds / (3600 * 24));

    if (diffInSeconds < 60) {
      return `${Math.max(diffInSeconds, 1)}s`;
    }
    
    if (diffInMinutes < 60) {
      return `${Math.max(diffInMinutes, 0)}m`;
    }

    if (diffInDays === 0 && diffInMinutes >= 60) {
      return `${Math.max(diffInHours, 0)}h`;
    }
    
    if (diffInDays === 1) {
      return '1d';  
    }

    return `${Math.max(diffInDays, 0)}d`;
  }
}