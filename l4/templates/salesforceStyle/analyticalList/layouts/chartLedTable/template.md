# Machine brief — Chart led table

Apply after the Salesforce global and Analytical list briefs. The set **told as a shape first**: one drawing leads the page, and it is not decoration — it is the control. The reader finds the pattern with their eyes, picks it on the drawing, and the itemization below narrows to exactly those records. Seeing and asking are one gesture, which is what this arrangement answers that a tile row cannot: which shape is odd, before anyone knows what to filter for.

A layout may require more than the page brief, and this one does: it needs a **declared grouping or series** — a dimension with its buckets, or a declared sequence of periods. Without one there is no shape to draw and no shape to pick, so **refuse without writing a page**, and say that the layout excluded it, not the page: the same fixture may still be a valid analytical list in the other arrangement.

It excludes the arrangement led by summary tiles with the filters as the steering wheel — that is the other layout. It also excludes a second chart competing for the lead, two granularities in one drawing, a chart that does not narrow the itemization, and any trend, forecast, cumulative line, target band or proportion the contract does not declare.

## State

```ts
pick: { bucket?: string; series?: string; range?: { from: string; to: string } } | null;   // the shape held
chartForm: 'categories' | 'periods' | 'parts';    // derived from the declared grouping, never chosen
filterValues: FilterValues;                        // the declared filter inputs, which reshape the drawing
sort: { column: Field; direction: 'asc' | 'desc' } | null;
selection: Set<Id>;
```

## Shapes and containment

| Shape | Arrangement |
| --- | --- |
| Wide | the drawing occupies the leading band at full width with a labelled axis, the pick sentence under it, and the itemization filling the rest and scrolling alone |
| Medium | the drawing keeps its band and its bucket width, and the itemization drops its lowest-priority columns whole |
| Narrow | the drawing keeps the lead and scrolls sideways at a readable bucket width, rather than shrinking until its labels collide |

- The page is viewport-bounded: the declared filter inputs, the drawing, the pick sentence and the pagination stay, and only the itemization's body scrolls vertically.
- Switch shape before an axis label truncates, before two buckets touch, and before the itemization has too few rows left to be evidence of anything.
- **The narrow shape keeps the drawing in the lead.** It never collapses into a row of numbers or drops the drawing to "save space": that is the other arrangement, answering another question, and degrading into it would silently swap what is being tested.
- Report the arithmetic: the number of declared buckets times the width a bucket needs to keep its label readable at the smallest type step, plus the value axis gutter, against the available width; and the drawing's band against the rows left for the itemization.

## The drawing

- One drawing, the largest thing on the page, above the itemization. It plots only values the contract declares, with their declared units, over the declared buckets.
- Its form follows the data's own shape and is never a preference: declared categories **compare** side by side, a declared period sequence **runs** in time order, and declared parts of a declared whole **divide** it. When the contract declares no whole, nothing is drawn as a share of one.
- One granularity per drawing. A second axis unit, a second scale or a second measure sharing the same plot makes two claims in one picture and neither can be read.
- The axis is labelled at the design system's smallest readable type step, and every label is a declared value's own label — never a key, never an abbreviation the contract did not declare.
- Series colours come from the design system's chart series steps, used in their declared order, one step per declared series, never repeated inside one drawing — the declared order is what keeps them distinguishable to a colourblind reader. When the declared series outnumber the steps, draw the ones that stay distinguishable, say how many were left out, and report the gap.
- Alarm colour appears only on a fact the contract flags. A tall bar is not an alarm, and a drawing coloured by magnitude ranks nothing.
- **A plotted value is not an icon.** The closed icon set governs icons; drawing the data with element geometry or vector primitives is how the shape exists at all. The style brief still holds otherwise: no chart library, no third-party widget, no copied markup — the drawing is built here, from design-system scales.
- Loading draws the frame and the axis first and the shapes after: the shape of the question survives while its answer is on the way.
- A drawing with nothing to plot stays present and says so. Blank is an answer, and a region that vanishes cannot be compared with the reading before it.

## Picking on the drawing

- A pick on the drawing **is** the narrowing: the itemization below shows exactly the records behind the picked shape. A drawing that does not narrow is decoration, and an itemization that can disagree with the current pick is worse than either alone.
- The picked shape stays visibly held, and the unpicked shapes recede while a pick is active — the drawing shows what the itemization is showing, without a legend to explain it.
- Picks combine only when the contract's inputs can carry the combination. Where they cannot, a new pick replaces the old one; never draw two held shapes while the query can only express one.
- **Every pick has an equivalent that needs no pointer.** The shapes are reachable and pickable from the keyboard, in the order they are drawn. A picture that can only be interrogated with a mouse locks out part of the people who have to read it.
- The pick is stated **in words** between the drawing and the itemization, naming the picked values in their declared labels, with one control to release it. That sentence is the page's single statement of what the itemization shows: a pick that survives only as a highlight leaves a narrowed set nobody can name, and releasing it restores the whole set with the drawing unchanged.
- A pick with no records behind it uses the itemization's filtered-empty state, and the sentence stays visible so the reader can see which pick emptied it.
- While the itemization narrows, the drawing never blocks and never redraws its axis: the reader is already looking at the next question. When the declared filter inputs change, the drawing itself is what redraws, and any held pick that the new shape no longer contains is released and said to be released.

## Icon employments it adds

The dismiss employment gains its second place: releasing the held pick, beside the sentence that names it. Nothing else — the shapes carry no icons, hover and hold are shown by the shapes themselves, and the pagination chevrons keep their single employment, because the drawing is never paged.
