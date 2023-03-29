export const imgPlaceHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=';

export function isNullOrEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}
