---
title: "组合总和两题：可以重复选数，怎样避免重复答案？"
date: "2026-10-27"
description: "沿着把 7 拆成 3、2、2 的想法，分清重复选取、同层去重和路径拷贝。"
---

把 7 写成 3 + 2 + 2，两个 2 可以来自同一个候选值吗？第 39 题允许，第 40 题要看数组里有没有第二个 2。这一点决定了递归下一层从哪里开始。

## 39 · 组合总和

从互不相同的正整数 `candidates` 中选数，允许反复使用同一个值。列出所有和恰好等于 `target` 的组合。相同数字只改变排列顺序算同一个组合，输出顺序不限。 [力扣原题全文](https://leetcode.cn/problems/combination-sum/description/)

**数据范围**　候选数共 1–30 个，数值为 2–40，目标为 1–40。题目给定的输入产生的不同组合少于 150 个。

**题目样例**　`candidates = [2, 3, 6, 7]`，`target = 7` → `[[2, 2, 3], [7]]`。

### 解题思路

当时把题目理解成拆数：7 可以直接取 7，也可以取 6 留 1，这条路走不通。取 3 留 4，则能继续拆成 2 和 2。沿这棵树写下去就是回溯。为了让 `3 + 2 + 2` 只出现一次，把候选数从大到小排，沿每条路径只用当前下标及其右边的数。第 39 题允许复用当前数，下一层从 `i` 开始。

## 40 · 组合总和 II

候选数组这次可以含重复值。找出总和为 `target` 的所有不同组合，每个数组位置至多选一次。两个不同位置上的相同数字可以一起选，结果中同样的一组数只收录一次。 [力扣原题全文](https://leetcode.cn/problems/combination-sum-ii/description/)

**数据范围**　候选数共 1–100 个，数值为 1–50，目标为 1–30。

**题目样例**　`candidates = [10, 1, 2, 7, 6, 1, 5]`，`target = 8` → `[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]`。

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
