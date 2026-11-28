---
title: "leetcode34:在排序数组中查找元素的第一个和最后一个位置"
date: "2026-10-26"
description: "分别用两次二分查找确定目标值的左右边界。"
---

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

## 解题思路

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
