import PhotosResult from "../types/photosResult";
import parsePage from "./parsePage";
import parsePhoto from "./parsePhoto";

export default function parsePhotosResult(json: any): PhotosResult {
  const photosJson: any[] = json.photo;

  return {
    page: parsePage(json),
    photos: photosJson.map((photoJson) => parsePhoto(photoJson)),
  };
}
