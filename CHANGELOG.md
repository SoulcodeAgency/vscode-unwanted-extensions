# Change Log

## [0.1.0] - 2023-01-09

- Initial release

## [0.1.1] - 2023-01-09

- Improved: Better handling and warning info if extensions.json is missing when running the extension

## [0.1.2] - 2023-01-09

- Fixed: Bug when `.vscode/extensions.json` existed but without any `unwantedRecommendations` set.

## [0.1.3] - 2023-01-09

- Added: Extension Icon

## [0.2.0] - 2023-01-09

- Change: Inverted the icon

## [0.3.0] - 2023-01-26

- README updated

## [0.4.0] - 2023-02-24

- Added: Supporting workspace settings (multi-root): define extensions in `***.code-workspace` file
- Improved: Lowering verbosity of some output

## [1.0.0] - 2024-01-04

- Extension migration to new publisher **Soulcode**

## [1.0.1] - 2024-01-04

- Fixed: `hjson` package should be a dependency, not devDependency

## [1.0.2] - 2024-01-05

- README updated

## [1.1.2] (pre-release) - 2024-01-16

Feature

- Added support for version ranges

Other

- README updated
- Introduced some logging
- Added JSONC support
- Added example project
- Added subfolder support

Internal

- Added system for update messages

## [1.2.0] Release version - 2024-10-31

Internal

- Extended logging

## [1.2.1] Release version - 2024-10-31

Internal

- Extended logging

## [1.2.2] Release version - 2024-11-02

Fixes

- Fixed bug in glob exclude pattern

## [1.2.3] Release version - 2024-11-15

Fixes

- Do not open the output channel automatically
