# Changelog

## 0.2.0 (2026-05-13)
### New Features
- Add support for mobile
- Images with the same name will now be added with a suffix instead of being overwritten
(e.g. `image.png` will become `image (1).png` if `image.png` already exists)

### Bug Fixes
- Fix not respecting custom attachment folder settings ([#7](https://github.com/jdholtz/obsidian-image-inserter/issues/7))

## 0.1.0 (2026-01-02)
### New Features
- Initial release (previously only pre-release)

### Bug Fixes
- Fix inserting images on the latest Obsidian/Electron versions
([#5](https://github.com/jdholtz/obsidian-image-inserter/issues/5))
- Fix attempting to insert images when no attachment folder has been configured (e.g. on a new vault)
- [Development] Add eslint and prettier support

## 0.0.2 (2024-01-08)

### Changes
- The name was changed from `Image Inserter` to `Simple Image Inserter`
    - Another plugin was already named `Image Inserter`, so it had to be changed

## 0.0.1 (2024-01-08)

### New Features
- Initial pre-release
    - This plugin has not been extensively tested, so expect issues at this stage
