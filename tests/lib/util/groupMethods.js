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
    name = "gap-px";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 7);
    expected.index = 7;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.type = "Gap";
    expected.value = "px";
    assert.deepEqual(actual, expected);
    name = "p-5";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 8);
    expected.index = 8;
    expected.name = name;
    expected.shorthand = "all";
    expected.variants = "";
    expected.type = "Padding";
    expected.value = "5";
    assert.deepEqual(actual, expected);
    name = "-my-px";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 9);
    expected.index = 9;
    expected.name = name;
    expected.shorthand = "y";
    expected.variants = "";
    expected.type = "Margin";
    expected.value = "-px";
    assert.deepEqual(actual, expected);

    // "Background Color" + "Background Opacity" + JIT
    // bg-red-600 + bg-opacity-50 = bg-red-600/50
    name = "bg-red-600";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 10);
    expected.index = 10;
    expected.name = name;
    expected.shorthand = "color";
    expected.variants = "";
    expected.type = "BACKGROUNDS";
    expected.value = "red-600";
    assert.deepEqual(actual, expected);
    name = "bg-opacity-50";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 11);
    expected.index = 11;
    expected.name = name;
    expected.shorthand = "opacity";
    expected.variants = "";
    expected.type = "BACKGROUNDS";
    expected.value = "50";
    assert.deepEqual(actual, expected);

    // "Border Radius"
    name = "rounded-tl-lg";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 13);
    expected.index = 13;
    expected.name = name;
    expected.shorthand = "tl";
    expected.variants = "";
    expected.type = "Border Radius";
    expected.value = "lg";
    assert.deepEqual(actual, expected);

    // "Border Width"
    name = "border-t-4";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 14);
    expected.index = 14;
    expected.name = name;
    expected.shorthand = "t";
    expected.variants = "";
    expected.type = "Border Width";
    expected.value = "4";
    assert.deepEqual(actual, expected);

    // "Border Color"
    name = "border-b-black";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 15);
    expected.index = 15;
    expected.name = name;
    expected.shorthand = "b";
    expected.variants = "";
    expected.type = "Border Color";
    expected.value = "black";
    assert.deepEqual(actual, expected);

    // "Scale"
    name = "scale-x-150";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 16);
    expected.index = 16;
    expected.name = name;
    expected.shorthand = "x";
    expected.variants = "";
    expected.type = "Scale";
    expected.value = "150";
    assert.deepEqual(actual, expected);
  });

  it(`should parse classnames with JIT`, function () {
    let name, actual, expected;
    expected = {
      index: 0,
      name: "",
      variants: "",
      type: "",
      value: "",
      shorthand: "",
    };
    mergedConfig.mode = "jit";
    // "Background Color" + "Background Opacity" + JIT
    // bg-red-600 + bg-opacity-50 = bg-red-600/50
    name = "bg-red-600/50";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 100);
    expected.index = 100;
    expected.name = name;
    expected.shorthand = "color";
    expected.variants = "";
    expected.type = "BACKGROUNDS";
    expected.value = "red-600/50";
    assert.deepEqual(actual, expected);

    // "Gradient Color Stops" + JIT
    name = "from-black/50";
    actual = groupUtil.parseClassname(name, targetGroups, mergedConfig, 101);
    expected.index = 101;
    expected.name = name;
    expected.shorthand = "color";
    expected.variants = "";
    expected.type = "Gradient Color Stops";
    expected.value = "black/50";
    assert.deepEqual(actual, expected);
  });

  it("should support named capture group", function () {
    const regex1 = /^((inset\-(?<pos>0|1|2|3)|\-inset\-(?<negPos>0|1|2|3)))$/;
    const str1 = "-inset-0";
    assert.equal(regex1.exec(str1).groups.negPos, "0");
  });
});
