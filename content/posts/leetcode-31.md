---
title: "leetcode31:下一个排列"
date: "2026-10-25"
description: "用一个五元素数组找出刚好变大的排列，再原地翻转后缀。"
---

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>给定整数数组 <code>nums</code>。把它的元素重新排列，每个数的出现次数保持不变。字典序从左往右比较两个排列，在第一个数值不同的位置，数值较小的一方排在前面。</p>
<p>把所有不同排列按这个顺序排好，要求将 <code>nums</code> 改成紧接其后的排列。若当前已是最后一个，就回到第一个，即数值升序排列。直接修改原数组，只可使用 O(1) 的额外空间。</p>
<p>例如，<code>[1,2,3]</code> 的排列依次为 <code>[1,2,3]</code>、<code>[1,3,2]</code>、<code>[2,1,3]</code>、<code>[2,3,1]</code>、<code>[3,1,2]</code>、<code>[3,2,1]</code>。因此 <code>[2,3,1]</code> 的下一项是 <code>[3,1,2]</code>。</p>
<p><strong>数据范围</strong>　数组含 1–100 个元素，每个元素在 0–100 之间，可以重复。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
nums = [1, 2, 3]
输出
[1, 3, 2]</code></pre>
<p>在按字典序排列的结果中，[1, 3, 2] 紧接在输入之后。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
nums = [3, 2, 1]
输出
[1, 2, 3]</code></pre>
<p>输入已经最大，下一步回到升序。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
nums = [1, 1, 5]
输出
[1, 5, 1]</code></pre>
<p>两个 1 的数值相同，互换它们不会产生更大的排列。</p>
<p><a href="https://leetcode.cn/problems/next-permutation/description/">题目来源：力扣 31 · 下一个排列</a></p>
</details>

## 解题思路

最初想到从右往左找一个可以变大的位置，交换，再把后面排序。用 `[2, 1, 5, 4, 3]` 手推才看清交换对象：能改的是 1，和相邻的 5 交换会一下跳过许多排列。右边比 1 大的数里，最小的是 3。换完得到 `[2, 3, 5, 4, 1]`，把后缀翻转，才是讨论中算出的 `[2, 3, 1, 4, 5]`。

从右边找到第一个 `a[i] < a[i+1]` 时，右侧已经按非递增顺序排列。从末尾遇到的第一个比 `a[i]` 大的数就是要换的数。换后后缀仍然非递增，所以原地翻转即可。若一路找不到这个位置，整个数组已经是最后一个排列，直接翻转回第一个。

```python
def next_permutation(a):
    i = len(a) - 2
    while i >= 0 and a[i] >= a[i + 1]:
        i -= 1
    if i >= 0:
        j = len(a) - 1
        while a[j] <= a[i]:
            j -= 1
        a[i], a[j] = a[j], a[i]
    left, right = i + 1, len(a) - 1
    while left < right:
        a[left], a[right] = a[right], a[left]
        left += 1
        right -= 1
```


找交换点和翻转后缀都只需线性扫描，最坏时间 O(n)。交换始终在原数组里完成。
