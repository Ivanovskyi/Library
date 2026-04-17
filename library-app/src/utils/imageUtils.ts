export const getBookImageUrl = (bookId: number): string => {
  return `${import.meta.env.VITE_API_URL}/books/${bookId}/image`;
};

export const fetchBookImageAsDataUrl = async (bookId: number): Promise<string> => {
  try {
    const response = await fetch(getBookImageUrl(bookId));
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const base64Data = await response.text();
    return base64Data.startsWith('data:') ? base64Data : `data:image/png;base64,${base64Data}`;
  } catch (error) {
    return '';
  }
};
