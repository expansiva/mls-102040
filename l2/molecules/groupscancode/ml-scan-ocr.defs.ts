/// <mls fileReference="_102040_/l2/molecules/groupscancode/ml-scan-ocr.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupScanCode';
export const skill = `# Metadata
- TagName: groupscancode--ml-scan-ocr

# Objective
Enable users to capture printed text using the device camera and optical character recognition, providing a live preview with a defined capture area, and presenting recognized text for review or correction before confirmation.

# Responsibilities
- Present an activation element that opens the camera interface; use custom content when provided, otherwise show a default activation element.
- Open the camera preview when activated and signal that the interface is now active.
- Display the live camera feed while the interface remains open.
- Provide a capture control during live preview that is identifiable to assistive technologies.
- Emit the captured image when the user triggers a capture.
- Support continuous automatic capture at configured intervals while the camera interface is active, if enabled.
- Transition to a result state when recognized text is supplied externally, replacing the live preview with the text outcome.
- Notify when the text value changes due to external updates.
- Display a customizable result region for text editing when provided; otherwise present the text in a non-editable format.
- Display optional supplementary information above and below the scanner area.
- Block camera activation and visually indicate unusability when the component is disabled.
- Display a processing state that prevents additional captures until processing completes.
- Close the camera interface and signal closure when dismissed manually or after presenting a result.
- Handle camera permission denials or hardware unavailability by entering an error state and presenting a clear message.
- Announce result changes to assistive technologies in a non-intrusive manner.
- Support standard keyboard patterns for activating the trigger and dismissing the interface.

# Constraints
- The activation element must support keyboard interaction following established accessibility conventions.
- The capture control must be clearly identifiable to users of assistive technologies.
- Camera interaction must be blocked during processing or when the component is disabled.
- Result updates must be communicated to assistive technologies without demanding immediate attention.
- Visual presentation must adapt to both light and dark themes.
- Distinct visual treatment must separate idle, loading, error, and result states.
- Disabled state must reduce visual prominence and remove interactive affordances from the trigger.
- The live preview must only appear while the camera interface is deliberately active.
- A visual indicator defining the capture zone must overlay the live preview.
- The result display must fully replace the camera preview when text is available.

# Notes
- The component depends on external systems to supply recognized text to enter the result state.
- Continuous capture is optional and controlled by external configuration.
- Custom content for activation and result regions is supplied through designated content areas.`;

