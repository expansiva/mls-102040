/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-file-upload-dropzone.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectFileForUpload';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  upload: "dropzone"
};

export const skill = `# Metadata
- TagName: groupselectfileforupload--ml-file-upload-dropzone

# Objective
Allow the user to select one or more files for upload by clicking a drop zone area or dragging and dropping files onto it. The component validates selected files against type, size, and count constraints before accepting them, maintains the accumulated list of accepted files, and gives visual feedback for drag, error, loading, and disabled states.

# Responsibilities
- Open the native file picker when the drop zone is clicked or activated with Enter or Space.
- Accept files dragged and dropped onto the zone and process them the same way as picker-selected files.
- Validate each incoming file against the accept pattern (extension or MIME type), the maxSizeKb limit, and the maxFiles count limit before adding it to the value.
- Dispatch a "reject" custom event for each batch of files that fail validation, including the files and the rejection reason ("type", "size", or "count").
- In single-file mode (multiple = false), replace any existing file with the first valid incoming file.
- In multi-file mode (multiple = true), append valid incoming files up to the maxFiles limit.
- Display the list of accepted files with their names and formatted sizes, and provide a remove button for each entry.
- Render a loading indicator and suppress all interaction while loading = true.
- Render an error message from the error property, replacing the helper text when both are present.
- Apply a highlighted drag-over appearance while files are being dragged over the zone.
- Render an optional Label slot above the zone and an optional Helper slot below it.
- Support a Trigger slot to replace the default icon-and-text drop zone content.

# Constraints
- All interaction (click, keyboard, drag-and-drop, remove) must be blocked when disabled = true or loading = true.
- Files that fail type, size, or count validation must never be added to value.
- In single-file mode, value must never contain more than one file.
- The drop zone must not be focusable (tabindex = -1) when disabled or loading.
- The error message must take precedence over the helper text; both must not be shown simultaneously.
- The hidden file input value must be cleared after each selection so the same file can be re-selected.
- File size rejection is based on the file's byte size divided by 1024 compared against maxSizeKb; a maxSizeKb of 0 means no size limit.
- A maxFiles of 0 means no file count limit in multi-file mode.`;
