/**
 * @fileoverview Test groupMethods utilities
 * @author François Massart
 */
"use strict";

var assert = require("assert");
var defaultGroups = require("../../../lib/config/groups").groups;
var customConfig = require("../../../lib/util/customConfig");
var groupUtil = require("../../../lib/util/groupMethods");
var mergedConfig = customConfig.resolve({});

describe("parseClassname", function () {
  const targetProperties = {
    LAYOUT: ["Overflow", "Overscroll Behavior", "Top / Right / Bottom / Left"],
    GRID: ["Gap"],
    SPACING: ["Padding", "Margin"],
    BACKGROUNDS: ["Background Color", "Background Opacity", "Gradient Color Stops"],
    BORDERS: ["Border Radius", "Border Width", "Border Color"],
    TRANSFORMS: ["Scale"],
  };
  const targetGroups = defaultGroups.filter((g) => Object.keys(targetProperties).includes(g.type));
  it("should have filtered `targetGroups`", function () {
    assert.equal(targetGroups.length, Object.keys(targetProperties).length);
  });
  it(`should parse classnames`, function () {
    let name, actual, expected;
    name = "overflow-x-auto";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 0);
    expected = {
      index: 0,
      name: name,
      variants: "",
      type: "Overflow",
      value: "auto",
      shorthand: "x",
    };
    assert.deepEqual(actual, expected);
    name = "md:overflow-y-auto";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 1);
    expected.index = 1;
    expected.name = name;
    expected.shorthand = "y";
    expected.variants = "md";
    assert.deepEqual(actual, expected);
    name = "lg:dark:overflow-auto";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 2);
    expected.index = 2;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "lg:dark";
    assert.deepEqual(actual, expected);
    name = "sm:dark:overscroll-x-none";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 3);
    expected.index = 3;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "sm:dark";
    expected.type = "Overscroll Behavior";
    expected.value = "none";
    assert.deepEqual(actual, expected);
    name = "inset-0";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 4);
    expected.index = 4;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.type = "Top / Right / Bottom / Left";
    expected.value = "0";
    assert.deepEqual(actual, expected);
    name = "sm:-inset-x-1";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 5);
    expected.index = 5;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "sm";
    expected.type = "Top / Right / Bottom / Left";
    expected.value = "-1";
    assert.deepEqual(actual, expected);
    name = "sm:-inset-x-1";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 6);
    expected.index = 6;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "sm";
    expected.type = "Top / Right / Bottom / Left";
    expected.value = "-1";
    assert.deepEqual(actual, expected);
  });
  it("should support named capture group", function () {
    const regex1 = /^((inset\-(?<pos>0|1|2|3)|\-inset\-(?<negPos>0|1|2|3)))$/;
    const str1 = "-inset-0";
    assert.equal(regex1.exec(str1).groups.negPos, "0");
  });
});
