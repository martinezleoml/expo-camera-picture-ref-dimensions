# expo-camera pictureRef dimensions bug reproduction

This repository demonstrates a bug in `expo-camera` where `takePictureAsync` with `pictureRef` returns inverted width/height dimensions on iOS.

## Bug Description

When taking a photo in portrait orientation using the `pictureRef` option, the `width` and `height` properties are swapped:

- **Expected:** `3024 x 4032` (width < height for portrait)
- **Actual:** `4032 x 3024` (width > height — inverted)

## How to Reproduce

1. Install dependencies:

  ```bash
  pnpm install
  ```

2. Run on iOS:

  ```bash
  npx expo run:ios
  ```

3. Hold the device in portrait orientation
4. Take a picture using the pictureRef method
5. Observe that picture.width > picture.height despite the photo being in portrait

## Root Cause

In `CameraViewModule.swift`, the Picture class uses CGImage dimensions which don't account for EXIF orientation:

```swift
Property("width") { (image: PictureRef) -> Int in
  return image.ref.cgImage?.width ?? 0  // ❌ Raw buffer dimensions
}
```

Should use `UIImage.size` instead:

```swift
Property("width") { (image: PictureRef) -> Int in
  return Int(image.ref.size.width)  // ✅ Orientation-aware dimensions
}
```

Affected Platforms

- iOS: ❌ Affected
- Android: ✅ Not affected (bitmap is physically rotated before storage)
