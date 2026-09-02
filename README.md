# 102040 · Molecules Catalogue

Part of **collab.codes**.

`102040` is the **catalogue of molecules** — the reusable UI building blocks the
frontend generator composes pages from. A "molecule" here is an interaction
group, named after what the user is doing rather than after a widget.

## What lives here

`l2/molecules/` holds ~32 groups, each a folder of `ml-*` Lit components
(`.ts` / `.html` / `.less` / `.defs.ts`), plus `summary.*` which indexes them:

- **enter** — `groupentertext`, `groupenternumber`, `groupentermoney`,
  `groupenterdate`, `groupenterdatetime`, `groupentertime`, their `*interval`
  variants, `groupenterboolean`
- **select** — `groupselectone`, `groupselectmany`, `groupselectfileforupload`
- **view** — `groupviewtable`, `groupviewdata`, `groupviewcard`, `groupviewchart`,
  `groupviewmetric`, `groupviewhierarchy`
- **navigate** — `groupnavigatemain`, `groupnavigatesection`, `groupnavigatesteps`
- **other** — `groupsearchcontent`, `groupexpandcontent`, `grouptriggeraction`,
  `groupshowprogress`, `groupnotifyuser`, `grouprateitem`, `groupscancode`,
  `groupplaymedia`, `grouplocateposition`

A single group can offer many variants — `groupviewtable` alone ships
`ml-data-table`, `ml-advanced-data-table`, `ml-pivot-table`, `ml-inline-edit-table`,
`ml-responsive-data-table`, `ml-grouping-table` and more.

## `test/` — isolated template runs

`test/` sits **outside** the `l1`..`l7` level folders on purpose: `buildCI` only
stages level folders, so nothing here reaches the build or `source.zip`. It runs
one `<style>/<template>` suite at a time (`salesforceStyle/…`, `polarisStyle/…`)
against a fixture and the design system, with no agent, no `l5/config.json`, no
publish and no VM. See `test/RUN.md` for the protocol and `test/harness/` for
the scripts.

## Notes

- `l4/templates/` holds the per-style template folders (currently empty on disk).
