---
title: "leetcode39:组合总和"
date: "2026-10-27"
description: "沿着把 7 拆成 3、2、2 的想法，用回溯列出可以重复选数的组合。"
---

<details class="problem-statement">
<summary>题面与示例（3 组）</summary>
<p>给定互不相同的正整数 <code>candidates</code> 和目标整数 <code>target</code>。每个候选值可以使用任意多次。请找出所有加起来恰好等于目标的组合，返回一个列表。</p>
<p>判断组合是否相同要看每个数字分别取了几次。改变顺序不会得到新组合，只要有一个数字的使用次数不同，就算另一组。各组合的返回顺序不限，若没有解就返回空列表。</p>
<p><strong>数据范围</strong>　候选数共 1–30 个，数值为 2–40，目标为 1–40。题目给定的输入产生的不同组合少于 150 个。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
candidates = [2, 3, 6, 7], target = 7
输出
[[2, 2, 3], [7]]</code></pre>
<p>2 可以取两次，与 3 凑成 7。也可以只取一个 7。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
candidates = [2, 3, 5], target = 8
输出
[[2, 2, 2, 2], [2, 3, 3], [3, 5]]</code></pre>
<p>三组的和都是 8。交换组内次序不会产生新组合。</p>
<p><strong>示例 3</strong></p>
<pre><code>输入
candidates = [2], target = 1
输出
[]</code></pre>
<p>最小候选数已经比目标大。</p>
<p><a href="https://leetcode.cn/problems/combination-sum/description/">题目来源：力扣 39 · 组合总和</a></p>
</details>

## 解题思路

当时把题目理解成拆数：7 可以直接取 7，也可以取 6 留 1，这条路走不通。取 3 留 4，则能继续拆成 2 和 2。沿这棵树写下去就是回溯。为了让 `3 + 2 + 2` 只出现一次，把候选数从大到小排，沿每条路径只用当前下标及其右边的数。第 39 题允许复用当前数，下一层从 `i` 开始。

```python
def combinations(candidates, target):
    values = sorted(candidates, reverse=True)
    result, path = [], []

    def visit(start, remaining):
        if remaining == 0:
            result.append(path.copy())
            return
        for i in range(start, len(values)):
            value = values[i]
            if value > remaining:
                continue
            path.append(value)
            visit(i, remaining - value)
            path.pop()

    visit(0, target)
    return result
```

候选数按降序排列。如果当前值大于剩余的和，后面还可能有较小的值可选，所以用 `continue`。找到答案时保存 `path.copy()`，让后面撤销选择的 `pop()` 只影响当前路径。
