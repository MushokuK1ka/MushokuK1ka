---
title: "外观数列：怎样把 1211 读成下一项？"
date: "2026-10-27"
description: "把每一段相邻相同的数字读成长度和数字，再逐项迭代。"
---

## 第 38 题 · 外观数列

第一项是字符串 `"1"`。此后从左到右读上一项，每遇到一段连续相同的数字，就依次写出这一段的长度和数字本身。把各段的结果连起来便是下一项。给定 `n`，返回第 `n` 项字符串。 [力扣原题全文](https://leetcode.cn/problems/count-and-say/description/)

**数据范围**　`1 ≤ n ≤ 30`。

**题目样例**　`n = 1` 得 `"1"`。`n = 4` 得 `"1211"`，因为第三项 `"21"` 读作“一个 2，一个 1”。

## 解题思路

这题的想法可以直接写成函数：给定上一项，把连续相同字符的长度和字符依次写入列表，再拼成下一项。`1211` 可以分为 `1 | 2 | 11`，读成“一个 1、一个 2、两个 1”，就得到 `111221`。相隔的两个 1 属于不同段，不能把整串交给词频表。

```python
def count_and_say(n):
    term = '1'
    for _ in range(1, n):
        parts = []
        start = 0
        while start < len(term):
            end = start + 1
            while end < len(term) and term[end] == term[start]:
                end += 1
            parts.extend([str(end - start), term[start]])
            start = end
        term = ''.join(parts)
    return term
```


例如算到第 4 项时，依次得到 `1 → 11 → 21 → 1211`。每一步只读上一项一次，用列表收集片段，最后一次拼接。总耗时取决于这 n 项的字符总数。
