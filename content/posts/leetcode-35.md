---
title: "leetcode35:搜索插入位置"
date: "2026-10-26"
description: "用半开区间找到第一个不小于目标值的位置。"
---

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

## 解题思路

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
