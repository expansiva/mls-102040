/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-code.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupScanCode';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {};

export const skill = `# Metadata
- TagName: groupscancode--ml-scan-code

# Objective
Allow the user to capture a video frame from the device camera for code scanning purposes. The component manages the camera lifecycle (open, capture, close), supports front and rear camera selection, optional automatic periodic frame capture, and transitions between trigger, viewfinder, and result states based on whether a scan value has been obtained.

# Responsibilities
- Show a trigger button (from the Trigger slot or a default label) when the camera is closed and no value has been captured yet.
- Open the device camera using getUserMedia with the facing constraint when the trigger button is clicked or openCamera is called.
- Render a live video viewfinder while the camera is open.
- Capture the current video frame to a PNG data URL and dispatch a capture custom event (bubbling, composed) with the image when the capture button is clicked.
- In auto-capture mode, fire the capture event on a repeating interval defined by captureInterval.
- Close the camera and stop all media tracks automatically when a non-null value is set.
- Close the camera and dispatch a close custom event (bubbling, composed) when the close button is clicked or Escape is pressed.
- Display the captured value (or custom Result slot content) and a "scan again" button after a successful capture.
- Dispatch a change custom event (bubbling, composed) with the new value whenever the value property changes.
- Dispatch an open custom event (bubbling, composed) when the camera stream becomes ready.
- Show appropriate error messages for permission-denied, camera-not-found, and unknown camera errors.
- Render an optional Label slot as a descriptive heading above the component.
- Render an optional Helper slot as secondary hint text below the component; the Helper text is replaced by the error message when an error is present.
- Stop all media tracks and cancel auto-capture timers when the component is disconnected from the DOM.
- Block camera opening, capture, and scan-again actions when the disabled property is true.
- Show a loading overlay on the viewfinder when the loading property is true.
- Support light and dark color schemes through conditional class application.

# Constraints
- The camera must not open while disabled is true or while the camera is already open.
- Frame capture must not occur when disabled, loading, the camera is not ready, or a capture is already in progress.
- Auto-capture timer must be cleared before a new one is started to avoid duplicate intervals.
- The component must not perform any code decoding or recognition; it only captures frames and emits them for external processing.
- Setting value to null (via scan again) must reopen the camera; the component itself does not interpret the scanned data.
- Media stream tracks must always be stopped when the camera is closed to release the hardware resource.`;
