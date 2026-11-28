---
title: "leecode38:外观数列"
date: "2026-10-27"
description: "把每一段相邻相同的数字读成长度和数字，再逐项迭代。"
---

## 题面与示例

<div class="problem-statement">
<p>外观数列的每一项都是字符串。第一项是 <code>&quot;1&quot;</code>，以后每一项取上一项的行程长度编码。给定正整数 <code>n</code>，返回第 <code>n</code> 项。</p>
<p>编码时从左向右，把连续相同的数字分成尽可能长的一段，再依次写下各段的长度和该段的数字。例如，<code>3322251</code> 分为 <code>33 | 222 | 5 | 1</code>，分别写成 <code>23 | 32 | 15 | 11</code>，拼起来就是 <code>23321511</code>。同一个数字如果隔开出现，需要分段计数。</p>
<p>进阶要求：尝试用迭代生成各项。</p>
<p><strong>数据范围</strong>　<code>1 ≤ n ≤ 30</code>。</p>
<p><strong>示例 1</strong></p>
<pre><code>输入
n = 4
输出
&quot;1211&quot;</code></pre>
<p>依次得到 &quot;1&quot;、&quot;11&quot;、&quot;21&quot;、&quot;1211&quot;。第三项 &quot;21&quot; 有一个 2，接着有一个 1。</p>
<p><strong>示例 2</strong></p>
<pre><code>输入
n = 1
输出
&quot;1&quot;</code></pre>
<p>第一项由定义直接给出。</p>
<p><a href="https://leetcode.cn/problems/count-and-say/description/">题目来源：力扣 38 · 外观数列</a></p>
</div>

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
