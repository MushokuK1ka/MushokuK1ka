---
title: "leetcode33:搜索旋转排序数组"
date: "2026-10-26"
description: "利用旋转数组中有序的那一半，决定下一步保留哪个区间。"
---

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

## 解题思路

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
