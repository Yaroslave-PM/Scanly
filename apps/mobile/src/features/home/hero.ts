import type { ImageSource } from 'expo-image';

/**
 * Фото шапки главной. Пока своего снимка нет, шапка рисуется оливковым градиентом.
 * Чтобы поставить фото: положить его в assets/hero/ и указать здесь require('../../../assets/hero/<файл>.jpg'),
 * автора записать в assets/hero/CREDITS.md.
 */
export const HERO_PHOTO: ImageSource | number | null = null;
