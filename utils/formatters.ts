export const formatOrderNumber = (index: number): string => {
  return `#${String(index).padStart(4, '0')}`;
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};