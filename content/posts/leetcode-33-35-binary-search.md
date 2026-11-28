---
title: "搜索旋转排序数组、在排序数组中查找元素的第一个和最后一个位置、搜索插入位置"
date: "2026-10-26"
description: "从同一个中点出发，分别决定该舍去半边、提前返回，还是留下插入点。"
---

同是二分查找，三道题对“找到了”的定义不同。旋转数组里命中即可返回。在有重复值的有序数组里，命中之后还得检查边界。找插入点时，即使区间已经搜空，指针仍能给出答案。

## 33 · 搜索旋转排序数组

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>原数组是严格递增的整数序列，没有重复元素。对于长度为 <code>n</code> 的数组，选取一个未知下标 <code>k</code>（<code>0 ≤ k &lt; n</code>），把前 <code>k</code> 个数整体移到末尾。于是原下标 <code>k…n−1</code> 的部分在前，<code>0…k−1</code> 的部分在后。<code>k = 0</code> 时顺序不变。</p>
<p>例如 <code>[0,1,2,4,5,6,7]</code> 左移三个位置可得 <code>[4,5,6,7,0,1,2]</code>。现在只给你旋转后的数组 <code>nums</code> 和一个整数 <code>target</code>。在 O(log n) 时间内返回目标在 <code>nums</code> 里的下标（从 0 开始）。目标不存在就返回 −1。</p>
<p><strong>数据范围</strong>　数组长度为 1–5000，元素互异，元素和目标均在 −10⁴ 至 10⁴ 之间。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
nums = [4, 5, 6, 7, 0, 1, 2], target = 0
输出
4</code></pre>
<p>旋转之后，0 在从零开始计数的下标 4。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
nums = [4, 5, 6, 7, 0, 1, 2], target = 3
输出
-1</code></pre>
<p>数组中没有 3。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
nums = [1], target = 0
输出
-1</code></pre>
<p>唯一的元素是 1。</p>
<p><a href="https://leetcode.cn/problems/search-in-rotated-sorted-array/description/">题目来源：力扣 33 · 搜索旋转排序数组</a></p>
</details>

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

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>给定非递减的整数数组 <code>nums</code> 和整数 <code>target</code>。数组中允许有重复值。请返回 <code>[起点, 终点]</code>，分别是目标第一次和最后一次出现的下标，下标从 0 开始。只出现一次时，两个下标相同。</p>
<p>若数组为空或目标没有出现，返回 <code>[-1, -1]</code>。整个查找须在 O(log n) 时间内完成。</p>
<p><strong>数据范围</strong>　数组长度为 0–10⁵，元素与目标均在 −10⁹ 至 10⁹ 之间。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
nums = [5, 7, 7, 8, 8, 10], target = 8
输出
[3, 4]</code></pre>
<p>两个 8 连续出现在下标 3 和 4。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
nums = [5, 7, 7, 8, 8, 10], target = 6
输出
[-1, -1]</code></pre>
<p>6 没有出现，两个端点都用 −1 表示。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
nums = [], target = 0
输出
[-1, -1]</code></pre>
<p>数组为空，没有可返回的下标。</p>
<p><a href="https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/">题目来源：力扣 34 · 在排序数组中查找元素的第一个和最后一个位置</a></p>
</details>

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

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>给定严格升序的整数数组 <code>nums</code> 和整数 <code>target</code>。若目标已经存在，返回它从 0 开始的下标。若不存在，返回把目标插入后仍能保持升序的位置。从头插入的下标是 0，追加到末尾的下标是数组长度。</p>
<p>只需返回位置，要求用 O(log n) 时间完成。</p>
<p><strong>数据范围</strong>　数组长度为 1–10⁴，元素和目标均在 −10⁴ 至 10⁴ 之间。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
nums = [1, 3, 5, 6], target = 5
输出
2</code></pre>
<p>5 已经在下标 2。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
nums = [1, 3, 5, 6], target = 2
输出
1</code></pre>
<p>插在 1 和 3 之间，新元素的下标为 1。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
nums = [1, 3, 5, 6], target = 7
输出
4</code></pre>
<p>7 大于末尾元素，插入点正好等于数组长度。</p>
<p><a href="https://leetcode.cn/problems/search-insert-position/description/">题目来源：力扣 35 · 搜索插入位置</a></p>
</details>

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
