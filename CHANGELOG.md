# copy-to-other-languages Changelog

## 3.3.0

### New Features

* Added "Copy all properties to..." to the more options menu of the translation view, so all properties can be copied to other languages while translating.

### Bug Fixes

* Fixed copying to other languages so it shows a clear error, instead of a generic save error, when a target language can no longer be edited because the content was locked or permissions were removed after the dialog was opened.

## 3.2.0

### New Features

* Added an action that copies all the properties of a content item to the other languages at once, instead of one field at a time. (#73, #74, #90)

* Shortened the labels of the copy actions in English, French and German. (#96)

## 3.1.1

### Other Changes

* The module now requires jcontent 3.2.0 and graphql-dxm-provider 3.2.0 or later. (#55)

## 3.1.0

### Bug Fixes

* Fixed the copy action so an empty field can also be copied to the other languages, to clear the value there. (#47)

## 3.0.1

### Bug Fixes

* Disabled the copy action when the content is locked and cannot be edited. (#40)

## 2.2.1 (Mon Jan 10 2022)

### 🐛 Bug Fix

* BACKLOG-16710 add content-editor [#8](https://github.com/Jahia/copy-to-other-languages/pull/8) ([@tdraier](https://github.com/tdraier))
* BACKLOG-16710 fixed typo [#7](https://github.com/Jahia/copy-to-other-languages/pull/7) ([@tdraier](https://github.com/tdraier))
* BACKLOG-16590 - Revert release and update dependencies [#6](https://github.com/Jahia/copy-to-other-languages/pull/6) ([@rknj](https://github.com/rknj))
* Add missing files [#5](https://github.com/Jahia/copy-to-other-languages/pull/5) ([@rknj](https://github.com/rknj))
* BACKLOG-16590 - Fix and prepare release [#4](https://github.com/Jahia/copy-to-other-languages/pull/4) ([@rknj](https://github.com/rknj))
* Fix env variables [#3](https://github.com/Jahia/copy-to-other-languages/pull/3) ([@rknj](https://github.com/rknj))
* BACKLOG-16675 : Added tests [#2](https://github.com/Jahia/copy-to-other-languages/pull/2) ([@tdraier](https://github.com/tdraier))
* BACKLOG-16586 - Add CircleCI config [#1](https://github.com/Jahia/copy-to-other-languages/pull/1) ([@rknj](https://github.com/rknj))

### ⚠️ Pushed to `main`

* BACKLOG-16590 - Fixed property syntax ([@tdraier](https://github.com/tdraier))
* update signature ([@tdraier](https://github.com/tdraier))
* Updated the config to use the latest version of the orb ([@Fgerthoffert](https://github.com/Fgerthoffert))
* renamed module ([@tdraier](https://github.com/tdraier))
* BACKLOG-16671 : more german labels ([@tdraier](https://github.com/tdraier))
* BACKLOG-16589 BACKLOG-16672 BACKLOG-16671 : labels ([@tdraier](https://github.com/tdraier))
* BACKLOG-16589 BACKLOG-16672 BACKLOG-16671 : disable action when not available, german labels ([@tdraier](https://github.com/tdraier))
* Upgrade moonstone ([@tdraier](https://github.com/tdraier))
* Implement locks, filters and error handling ([@tdraier](https://github.com/tdraier))
* Upgrade moonstone version ([@tdraier](https://github.com/tdraier))
* BACKLOG-16587: Fixed copy operation ([@tdraier](https://github.com/tdraier))
* BACKLOG-16587: Extend content-editor ([@tdraier](https://github.com/tdraier))
* Fixed modal height ([@tdraier](https://github.com/tdraier))
* Implement copy operation ([@tdraier](https://github.com/tdraier))
* Copy to all languages : initial commit ([@tdraier](https://github.com/tdraier))

### Authors: 3

* Francois G. ([@Fgerthoffert](https://github.com/Fgerthoffert))
* Michael De Checchi ([@rknj](https://github.com/rknj))
* Thomas Draier ([@tdraier](https://github.com/tdraier))
