interface Options {
  size?: 's' | 'q' | 't' | 'm' | 'n' | '-' | 'z' | 'c' | 'b' | 'h' | 'k' | 'o';
  extension?: 'jpg' | 'gif' | 'png';
  farm: number;
  secret: string;
  id: string;
  server: string;
}

export default function getPhotoUrl({
  extension = 'jpg',
  size,
  farm,
  secret,
  server,
  id,
}: Options) {
  const sizeParam = size ? `_${size}` : '';
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}${sizeParam}.${extension}`;
}
