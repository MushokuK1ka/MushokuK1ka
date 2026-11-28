---
title: "组合总和、组合总和 II"
date: "2026-10-27"
description: "沿着把 7 拆成 3、2、2 的想法，分清重复选取、同层去重和路径拷贝。"
---

把 7 写成 3 + 2 + 2，两个 2 可以来自同一个候选值吗？第 39 题允许，第 40 题要看数组里有没有第二个 2。这一点决定了递归下一层从哪里开始。

## 39 · 组合总和

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

### 解题思路

当时把题目理解成拆数：7 可以直接取 7，也可以取 6 留 1，这条路走不通。取 3 留 4，则能继续拆成 2 和 2。沿这棵树写下去就是回溯。为了让 `3 + 2 + 2` 只出现一次，把候选数从大到小排，沿每条路径只用当前下标及其右边的数。第 39 题允许复用当前数，下一层从 `i` 开始。

## 40 · 组合总和 II

<details class="problem-statement">
<summary>题面与示例（2 组）</summary>
<p>给定一组正整数 <code>candidates</code> 和目标整数 <code>target</code>。从数组中挑选若干个位置，使这些位置上的数字相加恰好等于目标，列出所有不同的组合。</p>
<p>每个位置在同一组合中最多取一次。输入可以含有相同的值，如果有两个 1，就可以把这两个 1 一起选入。按数字比较结果，相同的组合只保留一份，不能靠更换位置或调换顺序重复计入。</p>
<p><strong>数据范围</strong>　候选数共 1–100 个，数值为 1–50，目标为 1–30。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
candidates = [10, 1, 2, 7, 6, 1, 5], target = 8
输出
[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]</code></pre>
<p>输入里有两个独立的 1，所以 [1, 1, 6] 可以成立。用不同位置的 1 和 7 配对，得到的 [1, 7] 只收录一次。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
candidates = [2, 5, 2, 1, 2], target = 5
输出
[[1, 2, 2], [5]]</code></pre>
<p>可从三个 2 中挑两个配上 1，或者只选 5。所有挑法只对应这两种值组合。</p>
<p><a href="https://leetcode.cn/problems/combination-sum-ii/description/">题目来源：力扣 40 · 组合总和 II</a></p>
</details>

### 解题思路

第 40 题的每个位置只能用一次。我把递归起点改成 `i + 1`，打算收集完结果再去重，却超了内存。这里还缺一个条件。给两个值相同的 1 标上 `1a、1b`：在同一层先选 `1a` 或先选 `1b`，会产生重复的值组合。已经选完 `1a` 后，下一层再选 `1b`，却是得到 `[1, 1, 6]` 的必要步骤。所以跳过重复数字的条件必须包含 `i > start`。

```python
def combinations(candidates, target, *, single_use=False):
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
            if single_use and i > start and value == values[i - 1]:
                continue
            path.append(value)
            visit(i + 1 if single_use else i, remaining - value)
            path.pop()

    visit(0, target)
    return result
```

两题的候选数均为正数，第 39 题另有候选值互异的前提。这里选了降序，遇到太大的数字还得继续看较小的数，不能直接 `break`。保存答案时用 `path.copy()`，因为后面的 `pop()` 还要修改同一个列表。路径里都是整数，浅拷贝就足够了。


两题共用上面的函数。第 39 题调用 `combinations(candidates, target)`，第 40 题调用 `combinations(candidates, target, single_use=True)`。
