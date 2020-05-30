import Photo from '../types/photo';
import getPhotoUrl from '../utils/getPhotoUrl';

export default function parsePhoto(json: any): Photo {
  const farm: number = json.farm;
  const id: string = json.id;
  const secret: string = json.secret;
  const server: string = json.server;

  return {
    farm,
    id,
    owner: json.owner,
    secret,
    server,
    title: json.title,
    regularUrl: getPhotoUrl({
      size: 'n',
      farm,
      id,
      server,
      secret,
    }),
  };
}
