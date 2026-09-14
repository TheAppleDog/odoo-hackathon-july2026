# TransitOps - Manual QA Testing

## Overview

Manual QA testing was performed on the TransitOps Flask application.

The testing covered:

- Authentication
- Dashboard
- Vehicle management
- Driver management
- Trip management
- Maintenance management

## Testing Activities

- Manual functional testing
- Positive and negative testing
- Form validation testing
- Browser-based verification
- Test case documentation
- Defect identification and reporting
- Severity and priority classification

## Execution Summary

| Result | Count |
|---|---:|
| Passed | 7 |
| Failed | 3 |
| Blocked | 1 |
| Not Executed | 9 |
| Total Test Cases | 20 |

## Confirmed Defects

### BUG-001 - Add Vehicle Failure

The Add Vehicle flow is affected by:

`NameError: name 'vehicles_data' is not defined`

### BUG-002 - Edit Vehicle Failure

The Edit Vehicle flow references an undefined `vehicles_data` variable.

### BUG-003 - Delete Vehicle Failure

The Delete Vehicle flow references an undefined `vehicles_data` variable.

## Testing Notes

- Testing was performed on the existing project.
- No source code changes were made during this QA pass.
- Unexecuted tests were not marked as passed.
- The report does not claim successful CRUD execution.
- Regression testing after a fix was not performed.

## Documentation

- [Final QA Report](./TransitOps_QA_Final_Report.html)
- [Test Cases](./corrected_qa_test_cases.csv)
- [Defect Report](./DEFECT_REPORT.md)
- [Execution Summary](./EXECUTION_SUMMARY.md)
