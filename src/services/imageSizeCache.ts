export class ImageSizeCache {
    private static _instance: ImageSizeCache;

    public static getInstance(): ImageSizeCache {
        if (!ImageSizeCache._instance) {
            ImageSizeCache._instance = new ImageSizeCache();
        }

        return ImageSizeCache._instance;
    }

    private _cache: IDictionaryStringTo<number> = {};

    public store(url: string, height: number) {
        this._cache[url] = height;
    }

    public get(url: string): number {
        let decodedUrl = url.replace("&amp;", "&");

        return this._cache[decodedUrl];
    }
}