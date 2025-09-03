import { TSlot } from './packages.interface';

export const generateServiceId = (): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000-9999
  return `#SVC-${randomNumber}`;
};

// Slot Generator
export function generateTimeSlots(
  start: string,
  end: string,
  duration: number,
): TSlot[] {
  const slots: TSlot[] = [];

  const parseTime = (timeStr: string): Date => {
    const date = new Date();
    const [time, modifier] =
      timeStr.includes('AM') || timeStr.includes('PM')
        ? timeStr.split(' ')
        : [timeStr, ''];
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, minutes || 0, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  let current = parseTime(start);
  const endTime = parseTime(end);

  while (current.getTime() + duration * 60000 <= endTime.getTime()) {
    const next = new Date(current.getTime() + duration * 60000);
    slots.push({
      time: `${formatTime(current)} - ${formatTime(next)}`,
      status: 'available',
    });
    current = next;
  }

  return slots;
}
