---
# Allowed version bumps: patch, minor, major
copy-to-other-languages: major
---

Changed the module to require app-shell 4.0 or later. Since 3.3.0, its actions do not show on an earlier app-shell; the module now refuses to start there instead. Upgrade app-shell to 4.0 or later before you upgrade this module.
