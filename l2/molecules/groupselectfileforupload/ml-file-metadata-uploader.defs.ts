/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-file-metadata-uploader.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectFileForUpload';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  upload: "dropzone",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupselectfileforupload--ml-file-metadata-uploader

# Objective
Enable users to select files via click or drag-and-drop within a designated area, while accommodating supplementary metadata inputs in an integrated customizable region. The molecule manages file validation, maintains the active selection, communicates rejections, and respects disabled and loading states.

# Responsibilities
- Display an associated label when one is provided.
- Present a clickable and droppable area for file selection.
- Provide a customizable region where additional content, such as metadata fields, can be placed.
- Maintain the current set of selected files and update it only when incoming files pass validation.
- Validate incoming files against permitted types, size limits, and quantity limits before accepting them.
- Notify the external system when files are rejected, specifying the reason and identifying the rejected files.
- Preserve the existing selection unchanged when all incoming files are invalid.
- Visually indicate when files are being dragged over the selection area.
- Prevent all user interaction and ignore dragged files when disabled, keeping the selection unchanged.
- Prevent all user interaction and indicate an active loading state when loading is in effect.
- Accept document type options as content within the customizable region rather than through separate settings.
- Allow metadata field validation to be controlled externally, showing a visual error indication only when instructed.
- Display assistance text below the selection area when it is provided and no error is active.
- Communicate only file rejection scenarios internally; the external system must compose and submit the final file and metadata object.

# Constraints
- The current selection must not change if incoming files fail validation.
- All interaction and file updates must be blocked while the molecule is disabled or loading.
- Assistance text must be hidden when an error state is active.
- The molecule must not include built-in inputs or storage for metadata fields; these must reside within the customizable region.
- The molecule must not trigger final submission actions; assembly of the complete file and metadata payload is handled externally.
- Visual errors on metadata fields must appear only when instructed by the external system, not by internal logic.

# Notes
- The customizable region is intended to host metadata inputs, but the molecule does not track or validate the values entered there.
- Distinct visual treatments for dragging, disabled, loading, and error states must be clearly distinguishable.`;

