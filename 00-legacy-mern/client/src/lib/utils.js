import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Currency formatter
export function formatCurrency(amount, currency = 'SGD') {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Date formatter
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Truncate text
export function truncateText(text, length = 200) {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

// Calculate days difference
export function diffDays(from, to) {
  const day = 24 * 60 * 60 * 1000;
  const start = new Date(from);
  const end = new Date(to);
  const difference = Math.round(Math.abs((start - end) / day));
  return difference;
}

// Validate image file
export function isValidImage(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}