---
title: "三道二分查找：旋转数组、左右边界与插入位置"
date: "2026-10-26"
description: "从同一个中点出发，分别决定该舍去半边、提前返回，还是留下插入点。"
---

同是二分查找，三道题对“找到了”的定义不同。旋转数组里命中即可返回。在有重复值的有序数组里，命中之后还得检查边界。找插入点时，即使区间已经搜空，指针仍能给出答案。

## 33 · 搜索旋转排序数组

一个严格递增的整数数组经过循环左移，移动了多少位未知。给定移动后的 `nums` 和整数 `target`，返回目标在当前数组中的下标。找不到时返回 `-1`。时间限定为 O(log n)。 [力扣原题全文](https://leetcode.cn/problems/search-in-rotated-sorted-array/description/)

**数据范围**　数组长度为 1–5000，元素互异，元素和目标均在 −10⁴ 至 10⁴ 之间。

**题目样例**　`nums = [4, 5, 6, 7, 0, 1, 2]`，找 `0` 得 `4`，找 `3` 得 `-1`。

### 解题思路

在 `[4, 5, 6, 7, 0, 1, 2]` 里找 0，中点是 7。单凭“0 小于 7”向左走，就会把目标丢掉。题目保证元素互异，因此以中点为界，至少有一半有序。先认出有序的那半边，再用它的两个端点判断目标是否在里面。

```python
def search_rotated(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[lo] <= a[mid]:
            take_left = a[lo] <= target < a[mid]
        else:
            take_left = not (a[mid] < target <= a[hi])
        if take_left:
            hi = mid - 1
        else:
            lo = mid + 1
    return -1
```

## 34 · 在排序数组中查找元素的第一个和最后一个位置

给定非递减整数数组 `nums`。用 O(log n) 时间找出 `target` 第一次和最后一次出现的下标，按这个顺序返回两个值。如果没有这个数，返回 `[-1, -1]`。 [力扣原题全文](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)

**数据范围**　数组长度为 0–10⁵，元素与目标均在 −10⁹ 至 10⁹ 之间。

**题目样例**　`nums = [5, 7, 7, 8, 8, 10]`，找 `8` 得 `[3, 4]`，找 `6` 得 `[-1, -1]`。

### 解题思路

在 `[5, 7, 7, 8, 8, 10]` 里命中一个 8 以后，向两侧逐个找当然可行，但如果整条数组都是 8，代价就到了 O(n)。我想保留二分，并把停止条件说得更具体：找左端时，命中的元素左邻已经不同，或者它本身就是数组第一个元素，便可以立即返回。找右端时检查右邻。

```python
def search_range(a, target):
    def edge(left_edge):
        lo, hi = 0, len(a) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if a[mid] < target:
                lo = mid + 1
            elif a[mid] > target:
                hi = mid - 1
            elif left_edge:
                if mid == 0 or a[mid - 1] != target:
                    return mid
                hi = mid - 1
            else:
                if mid == len(a) - 1 or a[mid + 1] != target:
                    return mid
                lo = mid + 1
        return -1
    return [edge(True), edge(False)]
```

这是当时特意想拿去测试的写法。它在碰到边界时能提前结束，每轮会多做一次邻居判断。两趟二分的最坏时间仍是 O(log n)。

## 35 · 搜索插入位置

给定严格递增的整数数组和目标值。如果目标已存在，返回它的下标。如果不存在，返回把它插入后依然保持升序的下标。要求 O(log n) 时间。 [力扣原题全文](https://leetcode.cn/problems/search-insert-position/description/)

**数据范围**　数组长度为 1–10⁴，元素和目标均在 −10⁴ 至 10⁴ 之间。

**题目样例**　在 `[1, 3, 5, 6]` 中，`5` 的位置是 `2`，`2` 应插入下标 `1`，`7` 应插入下标 `4`（末尾）。

### 解题思路

题目希望查找失败时也给出有意义的位置。在升序数组 `[1, 3, 5, 6]` 里找 2，最后一个被排除的小数是 1，第一个较大的数是 3，插入位置就是下标 1。用半开区间写，退出时直接返回 `lo`，目标大于所有元素时它恰好等于数组长度。

```python
def search_insert(a, target):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
```
