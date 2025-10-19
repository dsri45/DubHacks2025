declare module 'expo-image-picker' {
  export type MediaTypeOptions = 'all' | 'videos' | 'images';
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  export type ImagePickerResult =
    | { cancelled: true }
    | { cancelled?: false; uri?: string; assets?: Array<{ uri: string; width?: number; height?: number; type?: string; }>; };

  export function requestMediaLibraryPermissionsAsync(): Promise<{ status: 'granted' | 'denied' | string }>;
  export function launchImageLibraryAsync(options?: {
    mediaTypes?: MediaTypeOptions | any;
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }): Promise<ImagePickerResult>;

<<<<<<< Updated upstream
  export default {
    requestMediaLibraryPermissionsAsync,
    launchImageLibraryAsync,
  };
=======
  const _default: {
    requestMediaLibraryPermissionsAsync: typeof requestMediaLibraryPermissionsAsync;
    launchImageLibraryAsync: typeof launchImageLibraryAsync;
  };

  export default _default;
>>>>>>> Stashed changes
}
