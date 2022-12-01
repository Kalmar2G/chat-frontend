import format from 'date-fns/format';
import { ru } from 'date-fns/locale';

export const convertToTimeDate = (date?: string | Date): string => {
  if (!date) {
    return '';
  }
  const newDate = new Date(date);
  return format(newDate, 'HH:mm dd.MM.yyyy', { locale: ru });
};

export const scrollToBottom = (element: HTMLDivElement | null) => {
  setTimeout(() => element?.scrollBy({
    top: 10000000000000000,
    left: 0,
    behavior: 'smooth'
  }), 50);
};
