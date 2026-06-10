/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-document.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupScanCode';
export const skill = `# Metadata
- TagName: groupscancode--ml-scan-document

# Objective
A scanner molecule that uses the device camera to detect document boundaries, allows manual refinement of detection corners, and produces a rectified cropped image of the document. It follows the groupScanCode contract for scanning workflows.

# Responsibilities
- Render the Label slot content above the scanner area when provided.
- Render the Helper slot content below the scanner area when provided.
- Render the Trigger slot as the control to open the camera while in the Idle state.
- Open and close the camera according to the isOpen state, signaling open and close events at the appropriate times.
- While the camera is active, continuously detect the document's four corners within the frame and maintain them as the active capture region.
- Display the camera viewfinder with an overlay showing the document contour lines and four corner markers positioned at the active corners when in the Open state.
- Provide visually distinct corner markers that indicate they can be manually adjusted.
- Allow the user to manually reposition each of the four corners to redefine the capture region.
- Provide visual feedback, such as a flash or pulse effect over the viewfinder, during capture.
- Upon capture, generate a rectified and cropped image using the active corners and notify via the capture event with the processed image data.
- When autoCapture is enabled, perform captures periodically according to the configured interval and notify via the capture event with the processed image data for each occurrence.
- Display a loading indicator over the scanner area while processing or decoding results.
- Block camera opening, capture, and manual adjustments when in a disabled state, and present the Trigger and scanner area as visually attenuated.
- Enter a Result state when a value is provided externally, hiding the viewfinder and presenting the result.
- Present the result using the Result slot when available; otherwise, display the value text as the default result.
- Announce result updates using polite live region behavior.
- Display error messages when provided, styled as an error, positioned below the scanner area, and associate them with accessibility attributes per the contract.
- Open the camera when the trigger is activated with Enter or Space keys, and close the camera when the Escape key is pressed.
- Maintain contract compatibility by keeping value as a string and emitting a change event when value is modified externally.
- Apply dark mode semantic pairing for surfaces, borders, text, error states, and highlights per the contract.

# Constraints
- The camera must only open when the component is not disabled.
- Corner detection must remain active only while the camera is open.
- Manual corner adjustments must override automatic detection for the active capture region.
- Capture must not occur if the component is disabled or loading.
- The processed image data must correspond to the region defined by the active corners at the moment of capture.
- Auto-capture must respect the specified interval and must not occur when disabled.
- Error messages must be presented only through the error property.
- The viewfinder must remain a visual element without keyboard focus.
- Visual states for idle, open, capturing, loading, result, error, and disabled must not overlap in presentation.

# Notes
- The component operates within the groupScanCode contract expectations for scanning molecules.
- Dark mode presentation must follow semantic pairing defined by the contract.`;

