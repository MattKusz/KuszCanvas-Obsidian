# KuszCanvas whiteboard features

This build of the plugin uses the KuszCanvas fork of Excalidraw
([MattKusz/KuszCanvas](https://github.com/MattKusz/KuszCanvas), branch
`kusch/whiteboard`), vendored in `vendor/excalidraw/`. `vendor/excalidraw/SOURCE.json`
records the engine commit. The features below live in that engine; the plugin
supplies two settings and the main-menu switches for them.

## Settings

| Setting | Default | Where |
| --- | --- | --- |
| **Blackboard dark mode** (`blackboardDarkMode`) | On | Settings, and a switch in the canvas main menu |
| **Render Markdown in text** (`renderMarkdownInText`) | On | Settings, and a switch in the canvas main menu |

Both apply to every open drawing, including drawings in popout windows, as soon
as you switch them. The main-menu switch and the settings page write the same
setting.

## Sticky notes

- Notes look like paper: corner radius 0.8% of the shorter side (at most 3 px),
  a soft shadow, a curled bottom edge and a slightly darker bottom strip.
- Each note varies a little in tone, curl and shadow. The variation comes from
  the element's seed, so a note looks the same every time it renders and in SVG
  and PNG exports. The stored background colour does not change.
- The sticky-note tool places each note at a random tilt of up to ±1.5°. The
  label follows the tilt while you read and edit it.
- New labels start at the top left of the note.
- `ExcalidrawAutomate.addStickyNote()` creates notes with no tilt.

## Frames

- New frames take the current stroke colour, stroke width, stroke style,
  sloppiness, background, fill style and edges, and draw like rectangles. The
  frame still clips its children and keeps its name label.
- Frames drawn before this change keep their grey outline. Changing any of their
  styles in the properties panel switches them to the rectangle style.
- Marker frames and AI frames are unchanged.
- Dynamic styling does not recolour rectangle-style frames
  (`customData.frameStyle: "shape"`).

### Frames grow to fit

- Drag an element into a frame and hold it over the edge for 300 ms: the frame
  grows to fit it with 16 px of padding. A drop before then leaves the element on
  top of the frame without joining it.
- Elements already in the frame, and freehand strokes started inside it, make it
  grow at once.
- Pull the selection away until its centre leaves the frame's original box and
  the frame returns to its original size; the drop does not join.
- Frames also grow after a drop, after resizing a child and when a label grows.
  They never shrink below their original size and never move their children.
  Locked, rotated and marker frames do not grow.
- One undo restores both the element and the frame.

## Shift-snapped freehand

Hold Shift during a freehand stroke to snap the part drawn after you pressed
Shift to 0°, 45° or 90°. Pen pressure and drawing speed still set the line
thickness. Release Shift to continue freehand from the pointer. Works with mouse
and pen and with every custom pen.

## Markdown in text

With **Render Markdown in text** on, free text, shape labels and sticky-note
labels show:

| Write | Shows |
| --- | --- |
| `**bold**` or `__bold__` | bold |
| `*italic*` or `_italic_` | italic (underscores only at word boundaries, so `snake_case` stays as typed) |
| `~~strike~~` | strikethrough |
| `==highlight==` | highlight |
| `<u>underline</u>` | underline |
| `` `code` `` | inline code |
| `- item`, `* item`, `+ item` | bullet list |
| `1. item` or `1) item` | numbered list |
| `> quote` | quote |
| GFM table rows | table |

- Headings, horizontal rules, fenced code and `#tags` show as typed.
- A marker without its closing pair shows as typed; `\` escapes a marker.
- Formatting can run across wrapped lines until a blank line.
- While editing, Ctrl/Cmd+B, I and U toggle bold, italic and underline. Lines
  holding the cursor or selection show their raw Markdown; the others show the
  formatted result.
- The stored text keeps its Markdown. Turning the setting off shows the raw text.
- SVG and PNG exports and drawing embeds in notes show the formatting.

## Blackboard dark mode

With **Blackboard dark mode** on and the drawing in dark theme:

- The canvas shows a dark slate board. Exports in dark theme use the same board.
- These draw as chalk: sketchy shapes, lines, arrows and frames (sloppiness
  artist or cartoonist), all freehand, and text in the hand-drawn font. Fills
  get a lighter grain.
- These stay solid: elements with architect sloppiness, text in other fonts,
  inline code, images and embeds.
- Sticky notes and their labels keep their light-theme paper colours.
- Turn the setting off, or switch to light theme, for the standard look.
