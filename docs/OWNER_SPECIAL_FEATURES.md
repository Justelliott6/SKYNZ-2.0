# Owner special features — design notes

These are design references, **not implemented features**. Keep optional visuals separate from authentication, AI routing, and creator permissions.

- **Lippy floating lips:** On the owner's special-features page, allow manual drag/reposition using mouse or touch. When voice is implemented, synchronize mouth movement to actual speech playback (initially amplitude, later phoneme/viseme timing). Keep lips stationary unless the owner moves them.
- **Floating rabbit Easter egg:** A discoverable, optional floating rabbit visual inspired by the old desktop companions. No automatic wandering or interruptions by default. The rabbit is a separate experiment from Lippy.
- **Design rule:** Owner-only by default. Do not expose these features to other creators or grant any AI permissions without a separate product decision.
- **Code Easter eggs:** Use clearly named, harmless comments or visual surprises, not concealed behaviors or privileged shortcuts.

Status: backlog/design reference only; local chat page and basic connector testing take priority.
