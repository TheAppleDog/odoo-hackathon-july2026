# Defect Report - TransitOps

## Project
TransitOps Flask application

## Scope
Vehicle, driver, trip, and maintenance management modules

## Defect Summary

### BUG-001
- Title: Add Vehicle fails due to undefined `vehicles_data`
- Severity: High
- Priority: High
- Status: Open / Confirmed by code inspection
- Affected Function: `save_vehicle()` in [app.py](app.py#L123-L209)
- Exact error: `NameError: name 'vehicles_data' is not defined`
- Root cause: `vehicles_data` is used in the add/edit logic, but no module-level `vehicles_data` variable is initialized before the function executes.
- Evidence: Code inspection of [app.py](app.py#L164-L199)

### BUG-002
- Title: Edit Vehicle fails due to undefined `vehicles_data`
- Severity: High
- Priority: High
- Status: Open / Confirmed by code inspection
- Affected Function: `save_vehicle()` edit branch in [app.py](app.py#L176-L190)
- Exact error: `NameError: name 'vehicles_data' is not defined`
- Root cause: the edit branch references `vehicles_data` for validation and update logic without initialization.
- Evidence: Code inspection of [app.py](app.py#L176-L190)

### BUG-003
- Title: Delete Vehicle fails due to undefined `vehicles_data`
- Severity: High
- Priority: High
- Status: Open / Confirmed by code inspection
- Affected Function: `delete_vehicle()` in [app.py](app.py#L211-L219)
- Exact error: `NameError: name 'vehicles_data' is not defined`
- Root cause: `delete_vehicle()` calls `global vehicles_data` and filters it, but there is no earlier defined list to operate on.
- Evidence: Code inspection of [app.py](app.py#L211-L219)

## Additional Notes
- The live browser execution performed for this QA pass validated render-only behavior and table uniqueness, not actual Add/Edit/Delete form submissions.
- The failed vehicle operations are therefore not considered resolved in the current code state.
- The same issue pattern may affect any route that assumes `vehicles_data` exists without correctly initializing it.
