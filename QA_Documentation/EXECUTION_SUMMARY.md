# Execution Summary - TransitOps QA

## Scope reviewed
- Authentication
- Dashboard
- Vehicle management
- Driver management
- Trip management
- Maintenance management

## Execution evidence used
- Live browser validation for login, dashboard, and rendered row uniqueness checks
- Source inspection of [app.py](app.py) to confirm the vehicle defects and impacted functions
- No code modifications were made during this verification process

## Verified browser executions
The following behaviors were actually executed in the running app:
- Login with valid credentials
- Login with invalid credentials
- Dashboard render
- Vehicles page render and uniqueness count
- Drivers page render and uniqueness count
- Trips page render and uniqueness count
- Maintenance page render and uniqueness count

## Not actually executed in browser
The following multi-step flows were not executed as live browser actions during the verification pass:
- Add Vehicle
- Edit Vehicle
- Delete Vehicle
- Trip create, edit, delete
- Maintenance create, edit, delete

## Defects confirmed by inspection
- BUG-001: Add Vehicle fails due to NameError in `save_vehicle()`
- BUG-002: Edit Vehicle fails due to NameError in the edit branch of `save_vehicle()`
- BUG-003: Delete Vehicle fails due to NameError in `delete_vehicle()`

## Accurate counts
- Passed: 7
- Failed: 3
- Blocked: 1
- Not Executed: 9
- Total tests: 20

## Notes
- Passed counts include only tests that were supported by actual browser execution and HTML evidence.
- Unexecuted tests are not marked as Passed.
- The vehicle add/edit/delete defects remain open in the current source state.
- No Add/Edit/Delete success was claimed.
