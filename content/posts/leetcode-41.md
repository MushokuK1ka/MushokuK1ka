---
title: "leetcode41:缺失的第一个正数"
date: "2026-10-28"
description: "用数组位置记录已经出现的值，在常数额外空间内找到缺口。"
---

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>输入一个未排序的整数数组 <code>nums</code>，其中可能有重复值，也可能有负数或零。请从正整数 1 开始，找出第一个没有出现在数组里的数并返回。</p>
<p>设 <code>n</code> 是数组长度。算法须在 O(n) 时间内完成，并且只使用 O(1) 额外空间。</p>
<p><strong>数据范围</strong>　数组长度为 1–10⁵，元素取值为 −2³¹ 至 2³¹ − 1，可以有负数、零和重复值。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
nums = [1, 2, 0]
输出
3</code></pre>
<p>1 和 2 都在，缺口从 3 开始。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
nums = [3, 4, -1, 1]
输出
2</code></pre>
<p>1 存在，2 缺失。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
nums = [7, 8, 9, 11, 12]
输出
1</code></pre>
<p>从最小正整数 1 开始就找不到了。</p>
<p><a href="https://leetcode.cn/problems/first-missing-positive/description/">题目来源：力扣 41 · 缺失的第一个正数</a></p>
</details>

## 解题思路

10 月 28 日的最后一道题要求在线性时间、常数额外空间内，找出未排序数组缺少的第一个正整数。对话停在了一个问题上：`[1, 1, 2]` 的第二个 1 也想去下标 0，可那里已经有一个 1，还要交换吗？下面补齐这一问的实现。

长度为 n 的数组，答案一定在 1 到 n + 1 之间。可以给 1 到 n 各安排一个位置，让数 x 去下标 x − 1。交换前先看目标位置，如果那里已经是 x，继续交换便永远没有进展。负数、零和超过 n 的数也都留在原处，等有用的数把它们换走。

```python
def first_missing_positive(a):
    n = len(a)
    for i in range(n):
        while 1 <= a[i] <= n:
            target = a[i] - 1
            if a[target] == a[i]:
                break
            a[target], a[i] = a[i], a[target]
    for i, value in enumerate(a):
        if value != i + 1:
            return i + 1
    return n + 1
```

例如 `[3, 4, -1, 1]` 依次变成 `[-1, 4, 3, 1]`、`[-1, 1, 3, 4]`、`[1, -1, 3, 4]`。第二个位置等不到 2，答案就是 2。虽然循环里套着循环，每一次真正发生的交换都会让一个数归位，已经归位的数也不会再被移走。整个数组最多做 n 次有效交换。
