# Change Log - @uifabric/merge-styles

This log was last generated on Thu, 02 Nov 2017 18:20:18 GMT and should not be manually modified.

## 5.5.1
Thu, 02 Nov 2017 18:20:18 GMT

### Patches

- When selectors use previously registered class names as values, they are now correctly auto expanded.

## 5.5.0
Tue, 24 Oct 2017 10:21:08 GMT

### Minor changes

- Adding `stroke` css property to typings.

## 5.4.2
Fri, 20 Oct 2017 18:42:08 GMT

### Patches

- Calling `mergeStyles` with strings containing space delimited class names was not expanding merge-styles generated class names in the final merge. Fixed so that it does.

## 5.4.1
Tue, 17 Oct 2017 17:17:41 GMT

### Patches

- mergeStyles: in RTL we were seeing exceptions with registering opacity: 0 in keyframes. This has been addressed and a test has been added to cover the case.

## 5.4.0
Fri, 13 Oct 2017 04:00:17 GMT

### Minor changes

- Fixes to support media queries.

### Patches

- Adding data-merge-styles attribute to the style element so that it can be uniquely identified.

## 5.3.3
Fri, 13 Oct 2017 01:36:02 GMT

### Patches

- Adding data-merge-styles attribute to the style element so that it can be uniquely identified.

## 5.3.2
Mon, 09 Oct 2017 10:08:09 GMT

### Patches

- Add test for autoexpand

## 5.3.1
Fri, 06 Oct 2017 10:18:41 GMT

### Patches

- TSConfig: update to use preserveConstEnums so that certain builds s ystems don't break when importing const enums

## 5.3.0
Thu, 05 Oct 2017 10:17:42 GMT

### Minor changes

- Adding selector support to target child class names that were generated in the same mergeStyleSets set.

## 5.2.0
Sat, 30 Sep 2017 01:26:37 GMT

### Minor changes

- Found that adding `false` to the list of accepted typings in `mergeStyleSets` was breaking type safety. Removed it.

## 5.1.0
Fri, 29 Sep 2017 10:20:24 GMT

### Minor changes

- The `mergeStyleSets` method's type safety was not correct. Now with significantly better type safety.

