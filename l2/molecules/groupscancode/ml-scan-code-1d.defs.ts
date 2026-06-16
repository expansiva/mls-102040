/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-code-1d.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupScanCode';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupscancode--ml-scan-code-1d

# Objective
A scanner specialized for reading linear 1D barcodes, including EAN-13, EAN-8, UPC-A, Code 128, and Code 39. It operates within the groupScanCode group, periodically emitting captured frames for external decoding while also attempting local decoding when available. Upon successful detection, it emits the barcode format and value. It supports camera selection, adjustable capture frequency, and manages distinct visual states for idle, open, capturing, loading, result, error, and disabled conditions.

# Responsibilities
- Adhere to the groupScanCode contract for properties, events, and slots.
- Allow selection between rear and front cameras.
- Adjust the frequency of frame capture when automatic capture is active.
- Open the camera only upon user action via the Trigger or through the group's defined open flow, signaling when the camera becomes active.
- Close the camera upon user action or through the group's defined close flow, signaling when the camera becomes inactive.
- Periodically capture and emit frames for external decoding while the camera is open and automatic capture is enabled.
- Attempt local decoding of 1D barcodes when a local decoding capability is available.
- Emit the detected barcode format and value when a code is successfully read.
- Emit a change notification when the decoded value is updated.
- Transition to the Result state and present the decoded value through the Result slot or a default display when a value is available.
- Display a processing indicator when loading is active, maintaining visual consistency with the capture state.
- Block opening and capture interactions and show a disabled visual state when disabled.
- Enter an Error state and display the error message when an error is provided.
- Support custom labeling, helper text, trigger content, and result presentation through dedicated slots.

# Constraints
- Must only target linear 1D barcode formats as specified.
- Must not emit detection events without both format and value.
- Must cease frame capture when the camera closes or when disabled.
- Must not access the camera before an explicit open action.
- Must reflect the current operational state visually according to the group contract states: Idle, Open, Capturing, Loading, Result, Disabled, and Error.
- Must remain visually consistent across light and dark themes.
- Must present decoded values clearly for enterprise use cases including inventory, retail point-of-sale, logistics, pharmacy, and asset management.

# Notes
- Local decoding serves as a performance optimization; the component continues to support external decoding for all frames.
- The molecule is optimized for corporate scanning scenarios requiring fast and reliable 1D barcode recognition.`;

