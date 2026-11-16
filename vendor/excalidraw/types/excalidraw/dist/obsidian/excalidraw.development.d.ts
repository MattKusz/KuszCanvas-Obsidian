export = debounce3;
export = debounce3;
declare function debounce3(func: any, wait: any, options: any): {
    (...args: any[]): any;
    cancel: () => void;
    flush: () => any;
};
declare namespace debounce3 {
    export { __esModule, sanitizeUrl2 as sanitizeUrl, encode, decode, is_jpeg, jpeg_segments_each, jpeg_segments_filter, jpeg_exif_tags_each, jpeg_exif_tags_filter, jpeg_add_comment, useSyncExternalStore, useSyncExternalStoreWithSelector };
}
declare const __esModule: boolean;
declare function sanitizeUrl2(url: any): any;
declare const encode: any;
declare const decode: any;
declare function is_jpeg(jpeg_bin: any): boolean;
declare function jpeg_segments_each(jpeg_bin: any, on_segment: any): void;
declare function jpeg_segments_filter(jpeg_bin: any, on_segment: any): Uint8Array<ArrayBuffer>;
declare function jpeg_exif_tags_each(jpeg_bin: any, on_exif_entry: any): void;
declare function jpeg_exif_tags_filter(jpeg_bin: any, on_exif_entry: any): any;
declare function jpeg_add_comment(jpeg_bin: any, comment2: any): any;
declare const useSyncExternalStore: any;
declare function useSyncExternalStoreWithSelector(subscribe: any, getSnapshot: any, getServerSnapshot: any, selector: any, isEqual: any): any;
