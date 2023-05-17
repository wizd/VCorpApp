import {FileSystem} from 'react-native-file-access';
import {atob} from 'react-native-quick-base64';

export const imgPlaceHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=';

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function isNullOrEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

export function isValidUrl(str: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export const readFirst44Bytes = async (
  filename: string,
): Promise<Uint8Array> => {
  try {
    const filePath = filename;
    const data = await FileSystem.readFile(filePath, 'base64');
    const dataArray = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    return dataArray.slice(0, 1024 * 8);
  } catch (error) {
    console.log('Error reading file: ', error);
    return new Uint8Array();
  }
};
