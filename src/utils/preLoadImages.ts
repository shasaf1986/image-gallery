// preload url list in
export default async function preloadImages(urls: string[]) {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        resolve();
      }
      image.onerror = () => {
        resolve();
      }
    });
  });

  await Promise.all(promises);
}
